"use client";

import { useRef, useState } from "react";
import { IconFileUpload, IconX } from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ACCEPTED_EXT: Record<string, string> = {
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PPTX",
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
  "video/mp4": "MP4",
  "text/html": "HTML",
};

const FORMAT_LABEL: Record<string, string> = {
  PPTX: "Apresentação",
  PDF: "PDF",
  DOCX: "Documento",
  XLSX: "Planilha",
  MP4: "Vídeo",
  HTML: "HTML",
};

const MAX_BYTES = 200 * 1024 * 1024;

export type UploadedFile = { path: string; ext: string; format: string; name: string };

type State =
  | { status: "idle" }
  | { status: "uploading"; progress: number; fileName: string }
  | { status: "error"; message: string }
  | { status: "done"; file: UploadedFile };

export function FileUploader({
  pathPrefix,
  onChange,
  disabled,
}: {
  pathPrefix: string;
  onChange: (file: UploadedFile | null) => void;
  disabled?: boolean;
}) {
  const [state, setState] = useState<State>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    const ext = ACCEPTED_EXT[file.type];
    if (!ext) {
      setState({ status: "error", message: "Formato não aceito. Use PPTX, PDF, DOCX, XLSX, MP4 ou HTML." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setState({ status: "error", message: "Arquivo maior que 200 MB." });
      return;
    }

    setState({ status: "uploading", progress: 0, fileName: file.name });

    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      setState({ status: "error", message: "Sessão expirada. Recarregue a página e tente de novo." });
      return;
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${pathPrefix}/${crypto.randomUUID()}-${safeName}`;
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/hub-materials/${path}`;

    await new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("apikey", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      xhr.setRequestHeader("x-upsert", "false");
      // Storage doesn't reliably infer this from the raw body, so it defaults
      // to text/plain without this — which would make "Abrir" show HTML
      // source instead of rendering the page.
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState({ status: "uploading", progress: Math.round((e.loaded / e.total) * 100), fileName: file.name });
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const uploaded: UploadedFile = { path, ext, format: FORMAT_LABEL[ext] ?? ext, name: file.name };
          setState({ status: "done", file: uploaded });
          onChange(uploaded);
        } else {
          setState({ status: "error", message: "Falha no upload. Tente novamente." });
        }
        resolve();
      };
      xhr.onerror = () => {
        setState({ status: "error", message: "Falha no upload. Verifique sua conexão." });
        resolve();
      };
      xhr.send(file);
    });
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) void upload(file);
  }

  function clear() {
    setState({ status: "idle" });
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (state.status === "uploading") {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6">
        <p className="text-sm font-bold text-foreground">Enviando {state.fileName}…</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
          <div className="h-full bg-primary transition-all" style={{ width: `${state.progress}%` }} />
        </div>
        <p className="mt-1 text-xs text-neutral-500">{state.progress}%</p>
      </div>
    );
  }

  if (state.status === "done") {
    return (
      <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{state.file.name}</p>
          <p className="text-xs text-neutral-500">Enviado com sucesso</p>
        </div>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"
          aria-label="Remover arquivo"
        >
          <IconX className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center transition-colors hover:border-primary hover:bg-primary/[0.04]",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconFileUpload className="size-5" />
        </span>
        <span className="text-sm font-bold text-foreground">Arraste o arquivo ou clique para escolher</span>
        <span className="text-xs text-neutral-500">PPTX, PDF, DOCX, XLSX, MP4 ou HTML · até 200 MB</span>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          disabled={disabled}
          accept=".pptx,.pdf,.docx,.xlsx,.mp4,.html,.htm"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {state.status === "error" && <p className="mt-2 text-xs text-destructive">{state.message}</p>}
    </div>
  );
}
