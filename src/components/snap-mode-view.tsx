import { Dialog, DialogContent } from "@/components/ui/dialog";

type SnapModeViewProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export default function SnapModeView({ open, onOpenChange, children }: SnapModeViewProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-transparent border-none shadow-none max-w-none w-auto flex items-center justify-center p-0">
                <div className="scale-100 md:scale-125 lg:scale-150 transition-transform duration-300">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
