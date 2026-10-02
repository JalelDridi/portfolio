import { metrics } from "@/content";
import { Reveal } from "../reveal";
import { NumberTicker } from "../ui/number-ticker";

export function Metrics() {
  return (
    <section
      aria-label="Results in numbers"
      className="border-y border-border bg-muted/40"
    >
      <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 px-5 py-10 lg:grid-cols-4">
        {metrics.map((metric, index) => {
          const number = metric.value.toLocaleString("en-US", {
            minimumFractionDigits: metric.decimals ?? 0,
          });
          const final = `${metric.prefix ?? ""}${number}${metric.suffix ?? ""}`;
          return (
            <Reveal
              key={metric.label}
              delay={index * 0.06}
              className="flex flex-col gap-1"
            >
              <dt className="order-2 text-base text-muted-foreground">
                {metric.label}
                <span className="block font-mono text-sm">{metric.source}</span>
              </dt>
              <dd className="order-1 text-4xl font-semibold tracking-tight sm:text-5xl">
                {/* The animated digits are decorative; the real value is read out. */}
                <span className="sr-only">{final}</span>
                <span aria-hidden="true">
                  {metric.prefix}
                  <NumberTicker
                    value={metric.value}
                    decimalPlaces={metric.decimals ?? 0}
                    className="text-foreground"
                  />
                  {metric.suffix}
                </span>
              </dd>
            </Reveal>
          );
        })}
      </dl>
    </section>
  );
}
