import { useState } from 'react';
import { Users, Search, Phone, Star, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePOS } from '@/contexts/POSContext';
import { members } from '@/data/mockData';

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const tierColors = {
  bronze: 'bg-amber-700/10 text-amber-700 border-amber-700/20',
  silver: 'bg-slate-400/10 text-slate-600 border-slate-400/20',
  gold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  platinum: 'bg-violet-500/10 text-violet-600 border-violet-500/20',
};

export function MemberModal({ open, onOpenChange }: MemberModalProps) {
  const { selectedMember, setSelectedMember } = usePOS();
  const [search, setSearch] = useState('');

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.phone.includes(search)
  );

  const handleSelect = (member: typeof members[0]) => {
    setSelectedMember(member);
    onOpenChange(false);
  };

  const handleClear = () => {
    setSelectedMember(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Pilih Member
          </DialogTitle>
          <DialogDescription>
            Cari member dengan nama atau nomor telepon.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama atau no. telepon..."
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Member list */}
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {filteredMembers.map(member => (
                <button
                  key={member.id}
                  onClick={() => handleSelect(member)}
                  className={`w-full p-4 rounded-lg border transition-colors text-left ${
                    selectedMember?.id === member.id 
                      ? 'border-primary bg-primary/5' 
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        {selectedMember?.id === member.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${tierColors[member.tier]} capitalize mb-1`}>
                        <Star className="h-3 w-3 mr-1" />
                        {member.tier}
                      </Badge>
                      <p className="text-sm font-medium text-primary">
                        {member.pointsBalance.toLocaleString('id-ID')} poin
                      </p>
                    </div>
                  </div>
                </button>
              ))}

              {filteredMembers.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <p>Member tidak ditemukan</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {selectedMember && (
            <Button variant="outline" className="w-full" onClick={handleClear}>
              Hapus Pilihan Member
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
