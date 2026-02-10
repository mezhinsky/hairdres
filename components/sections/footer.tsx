import { Scissors } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Scissors className="h-4 w-4" />
          <span>&copy; {new Date().getFullYear()} Парикмахер Ольга</span>
        </div>
        <p>Все права защищены</p>
      </div>
    </footer>
  );
}
