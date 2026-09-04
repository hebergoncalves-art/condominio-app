import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import {
  getOccurrence,
  listComments,
} from "@/features/occurrences/_data-access/occurrences";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  changeStatusAction,
  createCommentAction,
  updateCommentAction,
  deleteCommentAction,
  updateOccurrenceAction,
} from "../_actions/occurrences";
import { StatusForm } from "@/components/status-form";
import { CommentForm } from "@/components/comment-form";
import { CommentItem } from "@/components/comment-item";
import { OccurrenceForm } from "@/components/occurrence-form";
import { DeleteOccurrenceButton } from "@/components/delete-occurrence-button";
export default async function ResidentOccurrencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser("resident");
  const { id } = await params;
  const item = await getOccurrence(id);
  if (!item)
    return (
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold">
          Ocorrência não encontrada
        </h1>
        <Link href="/morador/ocorrencias">
          <Button>Voltar</Button>
        </Link>
      </div>
    );
  const comments = await listComments(id);
  const owner = item.authorId === user.id;
  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <Link href="/morador/ocorrencias">
        <Button variant="ghost">
          <ArrowLeft data-icon="inline-start" /> Voltar
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm text-primary">
                #{item.id.slice(0, 8)}
              </p>
              <CardTitle className="mt-2 text-3xl">{item.title}</CardTitle>
              <p className="mt-2 text-muted-foreground">
                {item.authorName} · {item.location}
              </p>
            </div>
            <StatusBadge status={item.status} />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <p className="whitespace-pre-wrap leading-7">{item.description}</p>
          {item.photoUrl && (
            <img
              src={item.photoUrl}
              alt="Foto da ocorrência"
              className="max-h-[420px] rounded-xl object-cover"
            />
          )}
          {owner && (
            <>
              <StatusForm
                id={item.id}
                current={item.status}
                action={changeStatusAction}
              />
              <div className="flex flex-wrap gap-3">
                <DeleteOccurrenceButton id={item.id} />
              </div>
              <OccurrenceForm
                id={item.id}
                initial={item}
                action={updateOccurrenceAction.bind(null, undefined)}
              />
            </>
          )}
          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl font-semibold">Comentários</h2>
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                canManage={comment.authorId === user.id}
                update={updateCommentAction}
                remove={deleteCommentAction}
              />
            ))}
            <CommentForm occurrenceId={item.id} action={createCommentAction} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
