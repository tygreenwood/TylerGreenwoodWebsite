import type { Project } from "../content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-surface transition hover:border-accent/50">
      {project.image && (
        <img
          src={project.image}
          alt=""
          className="aspect-[16/9] w-full border-b border-border object-cover"
          loading="lazy"
        />
      )}

      <div className="p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-lg font-medium tracking-tight">{project.name}</h3>
          {project.period && (
            <span className="text-xs uppercase tracking-wider text-muted">
              {project.period}
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-accent">{project.tagline}</p>
        <p className="mt-3 leading-relaxed text-muted">{project.description}</p>

        {project.stack.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        {(project.repo || project.demo) && (
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {project.repo && (
              <a
                href={project.repo}
                className="text-accent underline-offset-4 hover:underline"
              >
                Source →
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                className="text-accent underline-offset-4 hover:underline"
              >
                Live demo →
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
