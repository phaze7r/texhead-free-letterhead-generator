'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface ContactMessage {
    id: number;
    name: string;
    whatsapp: string;
    message: string;
    createdAt: Date;
}

export function ContactMessagesList({ messages }: { messages: ContactMessage[] }) {
    if (messages.length === 0) {
        return <p className="text-sm text-muted-foreground">No contact messages yet.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Message</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {messages.map((m) => (
                    <TableRow key={m.id}>
                        <TableCell className="text-xs whitespace-nowrap">
                            {format(new Date(m.createdAt), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell>
                            <a 
                                href={`https://wa.me/${m.whatsapp.replace(/[^0-9]/g, '')}`} 
                                target="_blank" 
                                className="text-primary hover:underline"
                            >
                                {m.whatsapp}
                            </a>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={m.message}>
                            {m.message}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
