"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  toast,
} from "@/niemeyer/components";
import { cn } from "@/lib/utils";
import { publishContent } from "@/lib/actions/gerenciar";
import { FileUploader, type UploadedFile } from "./file-uploader";

export type ProductOption = { id: string; name: string };
export type FeatureOption = { id: string; productId: string; name: string };
export type TrackOption = { id: string; productId: string; title: string };

export function GerenciarForm({
  products,
  features,
  tracks,
}: {
  products: ProductOption[];
  features: FeatureOption[];
  tracks: TrackOption[];
}) {
  const router = useRouter();
  const [kind, setKind] = useState<"material" | "lesson">("material");
  const [productId, setProductId] = useState<string>("");
  const [targetId, setTargetId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [publishToNovidades, setPublishToNovidades] = useState(true);
  const [notifySlack, setNotifySlack] = useState(true);
  const [isRequired, setIsRequired] = useState(false);
  const [isPending, startTransition] = useTransition();

  const targetOptions = useMemo(
    () =>
      kind === "material"
        ? features.filter((f) => f.productId === productId).map((f) => ({ id: f.id, label: f.name }))
        : tracks.filter((t) => t.productId === productId).map((t) => ({ id: t.id, label: t.title })),
    [kind, productId, features, tracks],
  );

  function resetForm() {
    setTitle("");
    setDescription("");
    setUploadedFile(null);
    setExternalUrl("");
    setPublishToNovidades(true);
    setNotifySlack(true);
    setIsRequired(false);
  }

  function handleSubmit(status: "draft" | "published") {
    if (!productId || !targetId) {
      toast(kind === "material" ? "Escolha o produto e a pasta da feature." : "Escolha o produto e a trilha.");
      return;
    }
    if (!title.trim()) {
      toast("Dê um título ao conteúdo.");
      return;
    }
    if (!uploadedFile && !externalUrl.trim()) {
      toast("Envie um arquivo ou cole um link.");
      return;
    }

    startTransition(async () => {
      try {
        await publishContent({
          kind,
          productId,
          targetId,
          title,
          description,
          upload: uploadedFile ? { path: uploadedFile.path, ext: uploadedFile.ext, format: uploadedFile.format } : null,
          externalUrl: externalUrl.trim() || null,
          status,
          publishToNovidades,
          notifySlack,
          isRequired,
        });
        toast(status === "published" ? "Publicado no hub." : "Rascunho salvo.");
        resetForm();
        router.refresh();
      } catch (err) {
        toast(err instanceof Error ? err.message : "Não foi possível salvar. Tente novamente.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-xs">
      <div>
        <p className="mb-2 text-sm font-bold text-foreground">O que você está subindo?</p>
        <div className="flex gap-2">
          {(["material", "lesson"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setKind(option);
                setTargetId("");
              }}
              className={cn(
                "flex h-8 items-center rounded-full border px-3 text-[13px] transition-colors",
                kind === option
                  ? "border-primary bg-primary font-bold text-primary-foreground"
                  : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
              )}
            >
              {option === "material" ? "Material" : "Aula de trilha"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Produto</label>
          <Select
            value={productId}
            onValueChange={(value) => {
              setProductId(value);
              setTargetId("");
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Escolha o produto" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-neutral-600">
            {kind === "material" ? "Pasta da feature" : "Trilha"}
          </label>
          <Select value={targetId} onValueChange={setTargetId} disabled={!productId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={productId ? "Escolha" : "Escolha o produto primeiro"} />
            </SelectTrigger>
            <SelectContent>
              {targetOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Título</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Release de agosto — peso por corretor"
          className="h-10 w-full rounded-lg border border-neutral-200 bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Descrição</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Uma linha sobre o que é e quando usar."
          className="min-h-[72px]"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-neutral-600">Arquivo</label>
        <FileUploader
          pathPrefix={`${productId || "geral"}/${targetId || "sem-pasta"}`}
          onChange={setUploadedFile}
          disabled={!!externalUrl.trim()}
        />
        <div className="my-3 flex items-center gap-3 text-xs text-neutral-400">
          <div className="h-px flex-1 bg-neutral-200" />
          ou
          <div className="h-px flex-1 bg-neutral-200" />
        </div>
        <input
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          placeholder="Cole um link do Drive, Notion, YouTube ou Loom"
          disabled={!!uploadedFile}
          className="h-10 w-full rounded-lg border border-neutral-200 bg-transparent px-3 text-sm outline-none disabled:opacity-50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-4">
        <ToggleRow
          label="Publicar em Novidades no hub"
          hint="Aparece no feed de novidades da Home enquanto estiver recente."
          checked={publishToNovidades}
          onCheckedChange={setPublishToNovidades}
        />
        <ToggleRow
          label="Avisar o time no Slack"
          hint="Envia um aviso para o canal configurado ao publicar."
          checked={notifySlack}
          onCheckedChange={setNotifySlack}
        />
        {kind === "lesson" && (
          <ToggleRow
            label="Marcar como obrigatório"
            hint="Sinaliza a trilha como obrigatória para o time."
            checked={isRequired}
            onCheckedChange={setIsRequired}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button variant="ghost" disabled={isPending} onClick={() => handleSubmit("draft")}>
          Salvar rascunho
        </Button>
        <Button isLoading={isPending} onClick={() => handleSubmit("published")}>
          Publicar no hub
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onCheckedChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-[13px] font-bold text-foreground">{label}</p>
        <p className="text-xs text-neutral-500">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} className="mt-0.5 shrink-0" />
    </div>
  );
}
