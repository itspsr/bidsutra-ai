import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EmptyState(props: { title: string; desc?: string; cta?: string; href?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        {props.desc ? <CardDescription>{props.desc}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {props.cta && props.href ? <Button variant="primary" onClick={() => location.assign(props.href!)}>{props.cta}</Button> : null}
      </CardContent>
    </Card>
  );
}
