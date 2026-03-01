import { tenders } from "@/lib/data";
import { inrCr, fmtDate } from "@/lib/format";
import { Table, THead, TR, TH, TD } from "@/components/ui/table";
import { RiskBadge } from "@/components/dashboard/RiskBadge";

export function TenderTable() {
  return (
    <Table>
      <THead>
        <TR>
          <TH>ID</TH>
          <TH>Tender</TH>
          <TH>Department</TH>
          <TH>State</TH>
          <TH>Deadline</TH>
          <TH>Value</TH>
          <TH>Match</TH>
          <TH>Risk</TH>
        </TR>
      </THead>
      <tbody>
        {tenders.map((t) => (
          <TR key={t.id} className="hover:bg-white/4 transition">
            <TD className="text-white/70">{t.id}</TD>
            <TD className="font-medium text-white/90">{t.title}</TD>
            <TD className="text-white/70">{t.dept}</TD>
            <TD className="text-white/70">{t.state}</TD>
            <TD className="text-white/70">{fmtDate(t.deadline)}</TD>
            <TD className="text-white/70">{inrCr(t.valueCr)}</TD>
            <TD className="text-white/80">{t.match}%</TD>
            <TD>
              <RiskBadge risk={t.risk} />
            </TD>
          </TR>
        ))}
      </tbody>
    </Table>
  );
}
