'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface LetterLogsProps {
  logs: any[]
}

export function LetterLogs({ logs }: LetterLogsProps) {
  if (logs.length === 0) {
      return <p className="text-sm text-muted-foreground py-4 text-center">No logs available yet.</p>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.companyName}</TableCell>
              <TableCell>{log.employeeName}</TableCell>
              <TableCell className="text-muted-foreground">{log.employeeEmail}</TableCell>
              <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
              <TableCell className="text-right">
                {new Date(log.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
