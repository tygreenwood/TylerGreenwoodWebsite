import type { Route } from "./+types/projects";
import { Container, PageHeading } from "../components/layout";
import { ProjectCard } from "../components/project-card";
import { projects, site } from "../content";

export function meta({}: Route.MetaArgs) {
  return [
    { title: `Projects — ${site.name}` },
    {
      name: "description",
      content: `Things ${site.name} has designed, built, and shipped.`,
    },
  ];
}

export default function Projects() {
  const featured = projects.filter((project) => project.featured);
  const rest = projects.filter((project) => !project.featured);

  return (
    <Container className="py-16 sm:py-20">
      <PageHeading
        title="Projects"
        lede="Things I've designed, built, and shipped — with a note on what each one was actually for."
      />

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-10 space-y-12">
          {featured.length > 0 && (
            <section>
              <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
                Featured
              </h2>
              <div className="mt-5 grid gap-6">
                {featured.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              {featured.length > 0 && (
                <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">
                  More
                </h2>
              )}
              <div className="mt-5 grid gap-6">
                {rest.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Container>
  );
}

/** Shown until the first project is added to `projects` in app/content.ts. */
function EmptyState() {
  return (
    <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
      <p className="font-medium">Projects are on the way.</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        I'm writing these up now. In the meantime, the fastest way to see how I
        work is to{" "}
        <a
          href={`mailto:${site.email}`}
          className="text-accent underline-offset-4 hover:underline"
        >
          ask me about it
        </a>
        .
      </p>
    </div>
  );
}
