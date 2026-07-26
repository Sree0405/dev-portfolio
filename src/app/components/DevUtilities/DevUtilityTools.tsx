import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "./CopyButton";
import {
  UtilityField,
  UtilityToolShell,
  utilityInputClass,
  utilityOutputClass,
  utilityTextareaClass,
} from "./UtilityToolShell";

function decodeBase64Url(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
}

function formatSql(sql: string): string {
  const keywords = [
    "SELECT",
    "FROM",
    "WHERE",
    "JOIN",
    "LEFT JOIN",
    "RIGHT JOIN",
    "INNER JOIN",
    "GROUP BY",
    "ORDER BY",
    "HAVING",
    "INSERT INTO",
    "VALUES",
    "UPDATE",
    "SET",
    "DELETE FROM",
    "CREATE TABLE",
    "ALTER TABLE",
    "DROP TABLE",
  ];

  let formatted = sql.replace(/\s+/g, " ").trim();
  for (const keyword of keywords.sort((a, b) => b.length - a.length)) {
    formatted = formatted.replace(new RegExp(`\\b${keyword}\\b`, "gi"), `\n${keyword}`);
  }
  return formatted
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function renderMarkdown(source: string): string {
  const escaped = source
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/^\s*[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hulo])/gm, (line) => (line ? `<p>${line}</p>` : ""));
}

function generatePassword(length: number, options: {
  upper: boolean;
  lower: boolean;
  numbers: boolean;
  symbols: boolean;
}) {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%^&*()-_=+[]{}";

  let charset = "";
  if (options.upper) charset += upper;
  if (options.lower) charset += lower;
  if (options.numbers) charset += numbers;
  if (options.symbols) charset += symbols;
  if (!charset) charset = lower + numbers;

  const values = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(values, (value) => charset[value % charset.length]).join("");
}

export function JsonFormatterTool() {
  const [input, setInput] = useState('{"name":"Developer Hub","active":true}');

  const { formatted, minified, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return {
        formatted: JSON.stringify(parsed, null, 2),
        minified: JSON.stringify(parsed),
        error: null as string | null,
      };
    } catch (err) {
      return {
        formatted: "",
        minified: "",
        error: err instanceof Error ? err.message : "Invalid JSON",
      };
    }
  }, [input]);

  return (
    <UtilityToolShell>
      <UtilityField label="Input JSON" actions={<CopyButton value={input} />}>
        <textarea className={utilityTextareaClass} value={input} onChange={(e) => setInput(e.target.value)} />
      </UtilityField>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <UtilityField
        label="Formatted"
        actions={
          <div className="flex gap-2">
            <CopyButton value={formatted} />
            <CopyButton value={minified} label="Minified copied" />
          </div>
        }
      >
        <pre className={utilityOutputClass}>{formatted || "—"}</pre>
      </UtilityField>
    </UtilityToolShell>
  );
}

export function JwtDecoderTool() {
  const [token, setToken] = useState("");

  const { decoded, error } = useMemo(() => {
    try {
      const parts = token.trim().split(".");
      if (!token.trim()) {
        return { decoded: null, error: null as string | null };
      }
      if (parts.length < 2) throw new Error("JWT must contain at least header and payload.");
      const header = JSON.parse(decodeBase64Url(parts[0] ?? ""));
      const payload = JSON.parse(decodeBase64Url(parts[1] ?? ""));
      return {
        decoded: {
          header: JSON.stringify(header, null, 2),
          payload: JSON.stringify(payload, null, 2),
        },
        error: null as string | null,
      };
    } catch (err) {
      return {
        decoded: null,
        error: err instanceof Error ? err.message : "Unable to decode JWT",
      };
    }
  }, [token]);

  return (
    <UtilityToolShell>
      <UtilityField label="JWT Token" actions={<CopyButton value={token} />}>
        <textarea className={utilityTextareaClass} value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOi..." />
      </UtilityField>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="grid gap-4 lg:grid-cols-2">
        <UtilityField label="Header" actions={decoded ? <CopyButton value={decoded.header} /> : null}>
          <pre className={utilityOutputClass}>{decoded?.header ?? "—"}</pre>
        </UtilityField>
        <UtilityField label="Payload" actions={decoded ? <CopyButton value={decoded.payload} /> : null}>
          <pre className={utilityOutputClass}>{decoded?.payload ?? "—"}</pre>
        </UtilityField>
      </div>
    </UtilityToolShell>
  );
}

export function UuidGeneratorTool() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = () => {
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  };

  useEffect(() => {
    generate();
  }, []);

  const output = uuids.join("\n");

  return (
    <UtilityToolShell>
      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-muted-foreground">Count: {count}</label>
        <Slider className="w-40" min={1} max={20} step={1} value={[count]} onValueChange={(v) => setCount(v[0] ?? 1)} />
        <Button variant="sreeDev" onClick={generate}>Generate</Button>
        <CopyButton value={output} />
      </div>
      <pre className={utilityOutputClass}>{output || "—"}</pre>
    </UtilityToolShell>
  );
}

export function Base64CodecTool() {
  const [input, setInput] = useState("Hello, Developer Hub!");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const { output, error } = useMemo(() => {
    try {
      if (mode === "encode") {
        return { output: btoa(unescape(encodeURIComponent(input))), error: null as string | null };
      }
      return {
        output: decodeURIComponent(escape(atob(input.trim()))),
        error: null as string | null,
      };
    } catch (err) {
      return {
        output: "",
        error: err instanceof Error ? err.message : "Conversion failed",
      };
    }
  }, [input, mode]);

  return (
    <UtilityToolShell>
      <div className="flex gap-2">
        <Button variant={mode === "encode" ? "sreeDev" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "sreeDev" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <UtilityField label="Input" actions={<CopyButton value={input} />}>
        <textarea className={utilityTextareaClass} value={input} onChange={(e) => setInput(e.target.value)} />
      </UtilityField>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <UtilityField label="Output" actions={<CopyButton value={output} />}>
        <pre className={utilityOutputClass}>{output || "—"}</pre>
      </UtilityField>
    </UtilityToolShell>
  );
}

export function UrlCodecTool() {
  const [input, setInput] = useState("https://example.com/search?q=dev utilities&lang=en");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = useMemo(() => {
    try {
      return mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch {
      return "";
    }
  }, [input, mode]);

  return (
    <UtilityToolShell>
      <div className="flex gap-2">
        <Button variant={mode === "encode" ? "sreeDev" : "outline"} onClick={() => setMode("encode")}>Encode</Button>
        <Button variant={mode === "decode" ? "sreeDev" : "outline"} onClick={() => setMode("decode")}>Decode</Button>
      </div>
      <UtilityField label="Input" actions={<CopyButton value={input} />}>
        <textarea className={utilityTextareaClass} value={input} onChange={(e) => setInput(e.target.value)} />
      </UtilityField>
      <UtilityField label="Output" actions={<CopyButton value={output} />}>
        <pre className={utilityOutputClass}>{output || "—"}</pre>
      </UtilityField>
    </UtilityToolShell>
  );
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    setPassword(generatePassword(length, { upper, lower, numbers, symbols }));
  };

  useEffect(() => {
    generate();
  }, [length, upper, lower, numbers, symbols]);

  return (
    <UtilityToolShell>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Uppercase", upper, setUpper],
          ["Lowercase", lower, setLower],
          ["Numbers", numbers, setNumbers],
          ["Symbols", symbols, setSymbols],
        ].map(([label, value, setter]) => (
          <label key={label as string} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2">
            <span className="text-sm">{label as string}</span>
            <Switch checked={value as boolean} onCheckedChange={setter as (v: boolean) => void} />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground">Length: {length}</span>
        <Slider className="w-48" min={8} max={64} step={1} value={[length]} onValueChange={(v) => setLength(v[0] ?? 16)} />
        <Button variant="sreeDev" onClick={generate}>Regenerate</Button>
        <CopyButton value={password} />
      </div>
      <Input className={utilityInputClass} readOnly value={password} />
    </UtilityToolShell>
  );
}

export function QrCodeGeneratorTool() {
  const [text, setText] = useState("https://sreefolio.vercel.app");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    void import("qrcode").then((QRCode) =>
      QRCode.toDataURL(text || " ", { margin: 1, width: 256 }).then((url) => {
        if (!cancelled) setDataUrl(url);
      }),
    );
    return () => {
      cancelled = true;
    };
  }, [text]);

  return (
    <UtilityToolShell>
      <UtilityField label="Text or URL" actions={<CopyButton value={text} />}>
        <Input className={utilityInputClass} value={text} onChange={(e) => setText(e.target.value)} />
      </UtilityField>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        {dataUrl ? <img src={dataUrl} alt="Generated QR code" className="h-48 w-48 rounded-lg border border-border/60 bg-white p-2" /> : null}
        {dataUrl ? (
          <Button variant="outline" asChild>
            <a href={dataUrl} download="qrcode.png">Download PNG</a>
          </Button>
        ) : null}
      </div>
    </UtilityToolShell>
  );
}

export function UnixTimestampTool() {
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [iso, setIso] = useState(new Date().toISOString());

  const parsedFromTs = useMemo(() => {
    const value = Number.parseInt(timestamp, 10);
    if (Number.isNaN(value)) return "Invalid timestamp";
    return new Date(value * 1000).toISOString();
  }, [timestamp]);

  const parsedFromIso = useMemo(() => {
    const value = Date.parse(iso);
    if (Number.isNaN(value)) return "Invalid date";
    return String(Math.floor(value / 1000));
  }, [iso]);

  return (
    <UtilityToolShell>
      <UtilityField label="Unix Timestamp (seconds)" actions={<CopyButton value={timestamp} />}>
        <Input className={utilityInputClass} value={timestamp} onChange={(e) => setTimestamp(e.target.value)} />
      </UtilityField>
      <p className="text-sm text-muted-foreground">→ {parsedFromTs}</p>
      <UtilityField label="ISO Date" actions={<CopyButton value={iso} />}>
        <Input className={utilityInputClass} value={iso} onChange={(e) => setIso(e.target.value)} />
      </UtilityField>
      <p className="text-sm text-muted-foreground">→ Unix: {parsedFromIso}</p>
      <Button variant="outline" onClick={() => {
        const now = Math.floor(Date.now() / 1000);
        setTimestamp(String(now));
        setIso(new Date(now * 1000).toISOString());
      }}>Use current time</Button>
    </UtilityToolShell>
  );
}

export function MarkdownPreviewTool() {
  const [source, setSource] = useState("# Hello\n\n**Developer Hub** markdown preview.\n\n- Fast\n- Simple\n- Useful");

  const html = useMemo(() => renderMarkdown(source), [source]);

  return (
    <UtilityToolShell>
      <div className="grid gap-4 lg:grid-cols-2">
        <UtilityField label="Markdown" actions={<CopyButton value={source} />}>
          <textarea className={utilityTextareaClass} value={source} onChange={(e) => setSource(e.target.value)} />
        </UtilityField>
        <UtilityField label="Preview">
          <div className="prose prose-invert max-w-none min-h-[140px] rounded-lg border border-border/60 bg-muted/20 p-4 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
        </UtilityField>
      </div>
    </UtilityToolShell>
  );
}

export function SqlFormatterTool() {
  const [input, setInput] = useState("SELECT id, name FROM users WHERE active = true ORDER BY created_at DESC");
  const output = useMemo(() => formatSql(input), [input]);

  return (
    <UtilityToolShell>
      <UtilityField label="SQL Query" actions={<CopyButton value={input} />}>
        <textarea className={utilityTextareaClass} value={input} onChange={(e) => setInput(e.target.value)} />
      </UtilityField>
      <UtilityField label="Formatted" actions={<CopyButton value={output} />}>
        <pre className={utilityOutputClass}>{output || "—"}</pre>
      </UtilityField>
    </UtilityToolShell>
  );
}

export function HtmlPreviewTool() {
  const [html, setHtml] = useState('<div style="padding:16px;font-family:sans-serif"><h2>Preview</h2><p>Hello <strong>world</strong></p></div>');

  return (
    <UtilityToolShell>
      <UtilityField label="HTML" actions={<CopyButton value={html} />}>
        <textarea className={utilityTextareaClass} value={html} onChange={(e) => setHtml(e.target.value)} />
      </UtilityField>
      <UtilityField label="Preview">
        <iframe title="HTML preview" sandbox="" srcDoc={html} className="h-64 w-full rounded-lg border border-border/60 bg-white" />
      </UtilityField>
    </UtilityToolShell>
  );
}

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Contact dev@example.com or visit example.com today.");

  const { matches, error } = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const rows = [...text.matchAll(regex)].map((match, index) => ({
        index: index + 1,
        match: match[0],
        groups: match.slice(1).join(", ") || "—",
        position: `${match.index ?? 0}`,
      }));
      return { matches: rows, error: null as string | null };
    } catch (err) {
      return {
        matches: [] as Array<{ index: number; match: string; groups: string; position: string }>,
        error: err instanceof Error ? err.message : "Invalid regex",
      };
    }
  }, [pattern, flags, text]);

  return (
    <UtilityToolShell>
      <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
        <Input className={utilityInputClass} value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Pattern" />
        <Input className={utilityInputClass} value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="Flags" />
      </div>
      <UtilityField label="Test String" actions={<CopyButton value={text} />}>
        <textarea className={utilityTextareaClass} value={text} onChange={(e) => setText(e.target.value)} />
      </UtilityField>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="overflow-auto rounded-lg border border-border/60">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Match</th>
              <th className="px-3 py-2">Groups</th>
              <th className="px-3 py-2">Index</th>
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 ? (
              <tr><td className="px-3 py-3 text-muted-foreground" colSpan={4}>No matches</td></tr>
            ) : (
              matches.map((row) => (
                <tr key={row.index} className="border-t border-border/40">
                  <td className="px-3 py-2">{row.index}</td>
                  <td className="px-3 py-2 font-mono">{row.match}</td>
                  <td className="px-3 py-2 font-mono text-muted-foreground">{row.groups}</td>
                  <td className="px-3 py-2">{row.position}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </UtilityToolShell>
  );
}
