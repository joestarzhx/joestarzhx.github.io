"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { generatedMaterials } from "@/generated/materials.generated";

export function ResumeDownload() {
  const path = generatedMaterials.resumePdf;

  if (!path) return null;

  return (
    <Button href={path} ariaLabel="下载张颢轩的 PDF 简历">
      <Download size={16} /> 下载 PDF 简历
    </Button>
  );
}
