import type { ComponentType } from "react";
import type { DevUtilityId } from "@/app/lib/devUtilities/registry";
import {
  Base64CodecTool,
  HtmlPreviewTool,
  JsonFormatterTool,
  JwtDecoderTool,
  MarkdownPreviewTool,
  PasswordGeneratorTool,
  QrCodeGeneratorTool,
  RegexTesterTool,
  SqlFormatterTool,
  UnixTimestampTool,
  UrlCodecTool,
  UuidGeneratorTool,
} from "./DevUtilityTools";

export const DEV_UTILITY_COMPONENTS: Record<DevUtilityId, ComponentType> = {
  "json-formatter": JsonFormatterTool,
  "jwt-decoder": JwtDecoderTool,
  "uuid-generator": UuidGeneratorTool,
  "base64-codec": Base64CodecTool,
  "url-codec": UrlCodecTool,
  "password-generator": PasswordGeneratorTool,
  "qr-code-generator": QrCodeGeneratorTool,
  "unix-timestamp": UnixTimestampTool,
  "markdown-preview": MarkdownPreviewTool,
  "sql-formatter": SqlFormatterTool,
  "html-preview": HtmlPreviewTool,
  "regex-tester": RegexTesterTool,
};
