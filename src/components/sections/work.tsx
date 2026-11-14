import { DoorStreet } from "../door-street";
import { Section } from "../section";

export function Work() {
  return (
    <Section
      id="work"
      arabic="باب"
      eyebrow="Bab · the work"
      title="Behind each door,"
      accent="something I shipped."
      description="Five doors, five projects. Hover or tap one and it opens. The nail patterns are the ones on the doors of the Tunis medina; each door's pattern belongs to its project."
    >
      <DoorStreet />
    </Section>
  );
}
