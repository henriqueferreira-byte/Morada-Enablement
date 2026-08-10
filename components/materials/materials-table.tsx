import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/niemeyer/components";
import { formatRelative, isWithinDays } from "@/lib/format";
import {
  CATEGORY_LABELS,
  CONTENT_TYPE_LABELS,
  isValidCategory,
  isValidContentType,
} from "@/lib/material-tags";
import type { MaterialRow } from "@/lib/queries/materials";
import { MaterialFileWell } from "./material-file-well";
import { MaterialRowActions } from "./material-row-actions";

function MaterialTags({ material }: { material: MaterialRow }) {
  const contentTypeLabel = material.content_type && isValidContentType(material.content_type)
    ? CONTENT_TYPE_LABELS[material.content_type]
    : null;
  const categoryLabel = material.category && isValidCategory(material.category)
    ? CATEGORY_LABELS[material.category]
    : null;

  if (!contentTypeLabel && !categoryLabel) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1">
      {contentTypeLabel && (
        <span className="rounded-full border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600">
          {contentTypeLabel}
        </span>
      )}
      {categoryLabel && (
        <span className="rounded-full border border-warning-border bg-warning-background px-1.5 py-0.5 text-[10px] font-semibold text-warning-text">
          {categoryLabel}
        </span>
      )}
    </div>
  );
}

export function MaterialsTable({
  materials,
  showLocation,
}: {
  materials: MaterialRow[];
  showLocation: boolean;
}) {
  return (
    <Table tableClassName="min-w-[900px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[2.4fr]">Arquivo</TableHead>
          {showLocation && <TableHead>Onde está</TableHead>}
          <TableHead>Formato</TableHead>
          <TableHead>Atualizado</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((material) => {
          const isNew = isWithinDays(material.updated_at, 7);
          return (
            <TableRow key={material.id}>
              <TableCell className="max-w-[360px]">
                <div className="flex items-center gap-3">
                  <MaterialFileWell ext={material.ext} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate font-heading text-sm font-semibold text-foreground">
                        {material.title}
                      </span>
                      {isNew && (
                        <span className="shrink-0 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                          NOVO
                        </span>
                      )}
                    </div>
                    {material.description && (
                      <p className="truncate text-xs text-neutral-500">{material.description}</p>
                    )}
                    <MaterialTags material={material} />
                  </div>
                </div>
              </TableCell>
              {showLocation && (
                <TableCell className="max-w-[200px] truncate text-[13px] text-neutral-600">
                  <Link href={`/materiais/${material.feature.product.id}/${material.feature.id}`} className="hover:text-primary">
                    {material.feature.product.name} · {material.feature.name}
                  </Link>
                </TableCell>
              )}
              <TableCell className="text-[13px] text-neutral-600">{material.format}</TableCell>
              <TableCell className="text-[13px] text-neutral-600">{formatRelative(material.updated_at)}</TableCell>
              <TableCell>
                <MaterialRowActions materialId={material.id} isLink={material.ext === "LINK"} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
