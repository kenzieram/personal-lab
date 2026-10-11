export type SubnetResult = { ip: string; cidr: number; network: string; broadcast: string; mask: string; total: number; usable: number; first: string; last: string };
function ipToInt(ip: string) { const parts = ip.split("."); if (parts.length !== 4 || parts.some(p => !/^\d{1,3}$/.test(p) || Number(p) > 255)) throw new Error("Enter a valid IPv4 address."); return parts.reduce((n, p) => ((n << 8) | Number(p)) >>> 0, 0); }
function intToIp(n: number) { return [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join("."); }
export function calculateSubnet(ip: string, cidr: number): SubnetResult {
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) throw new Error("CIDR prefix must be between /0 and /32.");
  const address = ipToInt(ip); const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0; const network = (address & mask) >>> 0; const broadcast = (network | (~mask >>> 0)) >>> 0; const total = 2 ** (32 - cidr);
  const usable = cidr === 31 ? 2 : cidr === 32 ? 1 : Math.max(0, total - 2);
  return { ip, cidr, network: intToIp(network), broadcast: intToIp(broadcast), mask: intToIp(mask), total, usable, first: intToIp(cidr === 32 ? network : network + 1), last: intToIp(cidr >= 31 ? broadcast : broadcast - 1) };
}
