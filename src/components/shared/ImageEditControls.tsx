import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useImageEdit } from '../../contexts/ImageEditContext';

export function ImageEditControls() {
  const {
    prompt,
    negativePrompt,
    seed,
    creativity,
    outputFormat,
    setPrompt,
    setNegativePrompt,
    setSeed,
    setCreativity,
    setOutputFormat,
  } = useImageEdit();

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background/60">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Prompt</label>
          <Input
            placeholder="Describe desired upscaling emphasis"
            value={prompt ?? ''}
            onChange={(e) => setPrompt(e.target.value || undefined)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Negative Prompt</label>
          <Input
            placeholder="What to avoid"
            value={negativePrompt ?? ''}
            onChange={(e) => setNegativePrompt(e.target.value || undefined)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm font-medium">Seed</label>
          <Input
            type="number"
            placeholder="e.g. 0 for random"
            value={seed ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setSeed(v === '' ? null : Number(v));
            }}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Creativity</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={creativity ?? 0}
            onChange={(e) => setCreativity(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-muted-foreground">{(creativity ?? 0).toFixed(2)}</div>
        </div>
        <div>
          <label className="text-sm font-medium">Output Format</label>
          <select
            className="w-full h-10 rounded-md border bg-background"
            value={outputFormat ?? ''}
            onChange={(e) => {
              const val = e.target.value as any;
              setOutputFormat(val === '' ? undefined : val);
            }}
          >
            <option value="">Backend default</option>
            <option value="png">PNG</option>
            <option value="jpeg">JPEG</option>
            <option value="webp">WEBP</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => {
          setPrompt(undefined);
          setNegativePrompt(undefined);
          setSeed(null);
          setCreativity(null);
          setOutputFormat(undefined);
        }}>
          Reset Controls
        </Button>
      </div>
    </div>
  );
}