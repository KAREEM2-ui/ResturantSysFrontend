import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const rows = [
  { metric: "Gross Sales", value: "$86,200", trend: "+11.7%" },
  { metric: "Food Cost Ratio", value: "28%", trend: "-1.3%" },
  { metric: "Labor Efficiency", value: "91%", trend: "+4.2%" },
];

export default function Reports() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.metric}>
                <TableCell>{row.metric}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.trend}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
