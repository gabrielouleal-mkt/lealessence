import { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductPhotoField({ label, preview, disabled, onSelect, onRemove }: {
  label: string; preview: string; disabled: boolean;
  onSelect: (file: File) => void; onRemove?: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return <div className="flex items-center gap-5">
    <div className="flex size-28 shrink-0 items-center justify-center rounded-md bg-cream">
      {preview ? <img src={preview} alt={label} className="size-full object-contain" /> : <Upload className="size-6 text-muted-foreground" />}
    </div>
    <div className="min-w-0 flex-1">
      <label className="block text-sm">{label}<input ref={input} aria-label={label} type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled} className="mt-2 block w-full text-xs" onChange={e => {
        const file = e.target.files?.[0]; if (file) onSelect(file);
        e.target.value = '';
      }} /></label>
      {onRemove && preview && <Button type="button" variant="ghost" size="sm" className="mt-2" disabled={disabled} onClick={onRemove}><X className="size-4" />Remover foto alternativa</Button>}
    </div>
  </div>;
}