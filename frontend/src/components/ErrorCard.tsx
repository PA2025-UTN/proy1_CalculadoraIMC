import { Card, CardContent } from "@/components/ui/card"
import { TriangleAlert } from "lucide-react"

export const ErrorCard = ({ message }: { message: string }) => (
  <Card className="p-2 pl-0 border-none shadow-none bg-red-100 mt-4">
    <CardContent>
      <div className="flex gap-2 items-center">
        <TriangleAlert className="text-red-500" size={20} />
        <p className="text-red-500 whitespace-pre-line">{message}</p>
      </div>
    </CardContent>
  </Card>
)
