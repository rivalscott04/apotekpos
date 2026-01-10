import { useState } from 'react';
import {
  Shield,
  Search,
  Filter,
  Calendar,
  User,
  Store,
  Eye,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { auditLogs, branches } from '@/data/mockData';
import type { AuditLog } from '@/types';

const actionColors: Record<string, string> = {
  CREATE: 'bg-success/10 text-success',
  UPDATE: 'bg-info/10 text-info',
  DELETE: 'bg-destructive/10 text-destructive',
  APPROVE: 'bg-primary/10 text-primary',
  REJECT: 'bg-warning/10 text-warning',
};

export default function AuditPage() {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = search === '' ||
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = branchFilter === 'all' || log.branchId === branchFilter;
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesBranch && matchesAction;
  });

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const uniqueActions = [...new Set(auditLogs.map(l => l.action))];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Audit Log
        </h1>
        <p className="text-muted-foreground mt-1">
          Riwayat aktivitas dan perubahan data di seluruh cabang.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari user, aksi, atau entitas..."
                className="pl-9"
              />
            </div>
            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="w-[200px]">
                <Store className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Cabang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Cabang</SelectItem>
                {branches.map(branch => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name.replace('Apotek Sehat ', '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Aksi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Aksi</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredLogs.length} Aktivitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Cabang</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Entitas</TableHead>
                <TableHead>ID</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {formatTime(log.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      {log.userName}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {log.branchName.replace('Apotek Sehat ', '')}
                  </TableCell>
                  <TableCell>
                    <Badge className={actionColors[log.action] || 'bg-muted'}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{log.entity.replace('_', ' ')}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.entityId}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedLog && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge className={actionColors[selectedLog.action] || 'bg-muted'}>
                    {selectedLog.action}
                  </Badge>
                  <span>{selectedLog.entity}</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">User</p>
                    <p className="font-medium">{selectedLog.userName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Cabang</p>
                    <p className="font-medium">{selectedLog.branchName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Waktu</p>
                    <p className="font-medium">{formatTime(selectedLog.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Entity ID</p>
                    <p className="font-mono text-sm">{selectedLog.entityId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">IP Address</p>
                    <p className="font-mono text-sm">{selectedLog.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">User Agent</p>
                    <p className="font-mono text-sm truncate">{selectedLog.userAgent}</p>
                  </div>
                </div>

                {/* Before/After Comparison */}
                {(selectedLog.before || selectedLog.after) && (
                  <div>
                    <p className="text-sm font-medium mb-3">Perubahan Data</p>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedLog.before && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Before</p>
                          <ScrollArea className="h-[200px]">
                            <pre className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-xs overflow-auto">
                              {JSON.stringify(selectedLog.before, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                      {selectedLog.after && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">After</p>
                          <ScrollArea className="h-[200px]">
                            <pre className="p-3 rounded-lg bg-success/5 border border-success/20 text-xs overflow-auto">
                              {JSON.stringify(selectedLog.after, null, 2)}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
