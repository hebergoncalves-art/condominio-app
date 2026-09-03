import { Badge } from "@/components/ui/badge"; import { statusLabels, statusStyles, type OccurrenceStatus } from "@/lib/domain";
export function StatusBadge({ status }: { status: OccurrenceStatus }) { return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>; }
