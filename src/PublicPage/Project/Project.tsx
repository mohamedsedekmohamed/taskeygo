import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, Mail, UserCircle, Calendar, Folder } from "lucide-react";
import Loader from "../../Component/Loading";

interface ProjectData {
  _id: string;
  email: string;
  user_id: string;
  project_id: {
    _id: string;
    name: string;
  };
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    message: string;
    projects: ProjectData[];
  };
}

const Project: React.FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<ApiResponse>(
          "https://taskatbcknd.wegostation.com/api/user/projects/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          setProjects(response.data.data.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading)
    return (
      <div className="min-h-screen text-center bg-white">
        <Loader color={"#000000"} />
      </div>
    );

  return (
    <div className="min-h-screen text-black bg-white">
      <div className="relative py-16 overflow-hidden">
        <div className="relative z-10 px-4">
          <div className="flex items-center justify-center mb-4">
            <Folder className="w-12 h-12 text-black" />
          </div>
          <h1 className="text-5xl font-extrabold text-center">
            Our Projects
          </h1>
          <p className="mt-4 text-lg text-center text-gray-700">
            Explore and manage all your projects in one place
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container px-4 pb-16 mx-auto max-w-7xl">
        {projects.length === 0 ? (
          <div className="py-16 text-center">
            <Folder className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-500">No projects available currently</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="relative overflow-hidden transition-all duration-300 bg-white border border-gray-200 shadow-md group rounded-2xl hover:shadow-lg hover:-translate-y-1"
              >
                {/* Card Content */}
                <div className="p-6">
                  {/* Project Title */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-bold text-/90 line-clamp-2">
                      {project.project_id.name}
                    </h2>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Folder className="w-6 h-6 text-gray-800" />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mb-6 space-y-3">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <span className="text-sm truncate">{project.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-700">
                      <UserCircle className="w-5 h-5 text-gray-500" />
                      <span className="inline-block px-3 py-1 text-sm font-medium text-white bg-gray-800 rounded-full">
                        {project.role}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="text-sm">{formatDate(project.createdAt)}</span>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => navigate(`/user/ProjectId/${project.project_id._id}`)}
                    className="flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 transform bg-black rounded-xl hover:bg-black/80"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Project</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;
