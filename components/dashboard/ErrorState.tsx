import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ErrorState(props: { title: string; desc?: string; onRetry?: () => void }) {
  return (
    <Card className="border-critical/25">
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        {props.desc ? <CardDescription>{props.desc}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {props.onRetry ? <Button variant="danger" onClick={props.onRetry}>Retry</Button> : null}
      </CardContent>
    </Card>
  );
}
