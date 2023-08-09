import React, { useEffect } from "react";
import { projectAPI } from "../../../api";
import { useFetch, useBanner } from "../../../hooks";
import { token } from "../../../util";
import { ArticleContent, ProjectCard, Banner } from "../../../components";

export function ListProjectPage() {
  const projectQuery = useFetch();
  const banner = useBanner();

  useEffect(() => {
    projectQuery.trigger(() => projectAPI.getProjects(token.get()));
  }, [projectQuery]);

  useEffect(() => {
    if (projectQuery.error.happened) {
      banner.show(projectQuery.error.message);
    }
  }, [banner, projectQuery.error.happened, projectQuery.error.message]);

  return (
    <>
      <Banner
        message={banner.message}
        onCloseClicked={banner.hide}
        visible={banner.visibility}
      />
      <ArticleContent title="Projects">
        <div className="flex flex-col gap-4">
          {projectQuery.success &&
            projectQuery.data
              .reverse()
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  description={project.description}
                  harvest={project.harvest}
                  projectId={project.id}
                  status={project.status}
                  startedAt={new Date(project.createdAt)}
                  link={`/admin/projects/${project.id}`}
                />
              ))}
        </div>
      </ArticleContent>
    </>
  );
}
