
export enum Blockchain {
  Ethereum = 'Ethereum (Solidity)',
  Solana = 'Solana (Rust)',
}

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface AuditFinding {
  vulnerability: string;
  severity: Severity;
  description: string;
  impact: string;
  recommendation: string;
  codeFix: string;
  location: {
    lines: string;
  };
}

export interface AuditReport {
  findings: AuditFinding[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    informational: number;
    total: number;
  };
}
