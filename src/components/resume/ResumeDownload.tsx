"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

export function ResumeDownload() {
  const [exists, setExists] = useState(false);
  const path = "/resume/haoxuan-zhang-resume.pdf";

  useEffect(() => {
    fetch(path, { method: "HEAD" })
      .then((res) => setExists(res.ok))
      .catch(() => setExists(false));
  }, []);

  if (!exists) return null;

  return (
    <Button href={path}>
      <Download size={16} /> 下载 PDF 简历
    </Button>
  );
}
