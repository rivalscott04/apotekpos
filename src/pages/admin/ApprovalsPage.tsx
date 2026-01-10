import { useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  User,
  Store,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { approvalRequests } from '@/data/mockData';
import type { ApprovalRequest, ApprovalType } from '@/types';

const typeLabels: Record<ApprovalType, string> = {
  discount: 'Diskon',
  void: 'Void',
  refund: 'Refund',
  adjustment: 'Penyesuaian',
  points_overlimit: 'Poin Overlimit',
};

const typeColors: Record<ApprovalType, string> = {
  discount: 'bg-info/10 text-info border-info/20',
  void: 'bg-destructive/10 text-destructive border-destructive/20',
  refund: 'bg-warning/10 text-warning border-warning/20',
  adjustment: 'bg-muted text-muted-foreground',
  points_overlimit: 'bg-primary/10 text-primary border-primary/20',
};

const riskColors = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

export default function ApprovalsPage() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const filteredApprovals = approvalRequests.filter(approval => {
    const matchesType = selectedType === 'all' || approval.type === selectedType;
    const matchesSearch = search === '' ||
      approval.requesterName.toLowerCase().includes(search.toLowerCase()) ||
      approval.branchName.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch && approval.status === 'pending';
  });

  const handleApprove = () => {
    if (!selectedApproval || !reviewNotes.trim()) return;
    // In real app, call API
    console.log('Approved:', selectedApproval.id, reviewNotes);
    setSelectedApproval(null);
    setReviewNotes('');
  };

  const handleReject = () => {
    if (!selectedApproval || !reviewNotes.trim()) return;
    // In real app, call API
    console.log('Rejected:', selectedApproval.id, reviewNotes);
    setSelectedApproval(null);
    setReviewNotes('');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          Approval Center
        </h1>
        <p className="text-muted-foreground mt-1">
          Review dan proses permintaan persetujuan dari kasir dan staf.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pemohon atau cabang..."
            className="pl-9"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="discount">Diskon</SelectItem>
            <SelectItem value="void">Void</SelectItem>
            <SelectItem value="refund">Refund</SelectItem>
            <SelectItem value="adjustment">Penyesuaian</SelectItem>
            <SelectItem value="points_overlimit">Poin Overlimit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {(['discount', 'void', 'refund', 'points_overlimit'] as ApprovalType[]).map(type => {
          const count = approvalRequests.filter(a => a.type === type && a.status === 'pending').length;
          return (
            <Card key={type} className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setSelectedType(type)}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{typeLabels[type]}</p>
                    <p className="text-2xl font-semibold">{count}</p>
                  </div>
                  <Badge className={typeColors[type]}>{typeLabels[type]}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Menunggu Persetujuan</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {filteredApprovals.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Tidak ada permintaan yang menunggu</p>
                </div>
              ) : (
                filteredApprovals.map(approval => (
                  <button
                    key={approval.id}
                    onClick={() => setSelectedApproval(approval)}
                    className="w-full p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={typeColors[approval.type]}>
                            {typeLabels[approval.type]}
                          </Badge>
                          <Badge className={riskColors[approval.riskLevel]}>
                            {approval.riskLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            Risiko {approval.riskLevel}
                          </Badge>
                        </div>
                        <p className="font-medium">{approval.reason}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {approval.requesterName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Store className="h-3 w-3" />
                            {approval.branchName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(approval.createdAt)}
                          </span>
                        </div>
                      </div>
                      {approval.amount && (
                        <p className="font-semibold text-lg">
                          Rp {approval.amount.toLocaleString('id-ID')}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Detail Sheet */}
      <Sheet open={!!selectedApproval} onOpenChange={() => setSelectedApproval(null)}>
        <SheetContent className="sm:max-w-md">
          {selectedApproval && (
            <>
              <SheetHeader>
                <SheetTitle>Detail Permintaan</SheetTitle>
                <SheetDescription>
                  Review dan berikan keputusan untuk permintaan ini.
                </SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Type & Risk */}
                <div className="flex items-center gap-2">
                  <Badge className={typeColors[selectedApproval.type]}>
                    {typeLabels[selectedApproval.type]}
                  </Badge>
                  <Badge className={riskColors[selectedApproval.riskLevel]}>
                    Risiko {selectedApproval.riskLevel}
                  </Badge>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Alasan</p>
                    <p className="font-medium">{selectedApproval.reason}</p>
                  </div>
                  
                  {selectedApproval.amount && (
                    <div>
                      <p className="text-sm text-muted-foreground">Nominal</p>
                      <p className="text-xl font-semibold">
                        Rp {selectedApproval.amount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Pemohon</p>
                      <p className="font-medium">{selectedApproval.requesterName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cabang</p>
                      <p className="font-medium">{selectedApproval.branchName}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Waktu</p>
                    <p>{formatTime(selectedApproval.createdAt)}</p>
                  </div>

                  {/* Details JSON */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Detail Tambahan</p>
                    <pre className="p-3 rounded-lg bg-muted text-xs overflow-auto">
                      {JSON.stringify(selectedApproval.details, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Review Notes */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Catatan Review <span className="text-destructive">*</span>
                  </p>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Berikan catatan untuk keputusan Anda..."
                    rows={3}
                  />
                </div>
              </div>

              <SheetFooter className="gap-2">
                <Button
                  variant="outline"
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleReject}
                  disabled={!reviewNotes.trim()}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Tolak
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleApprove}
                  disabled={!reviewNotes.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Setujui
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
