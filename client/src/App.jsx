import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  BarChart3,
  Settings,
  Search,
  Bell,
  ChevronRight,
  Clock3,
  Play,
  Flame,
  Menu,
  X,
  LogOut,
  CircleHelp,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

import { useState, useEffect } from "react";

import Auth from "./components/Auth";

import {
  getCurrentUser,
  updateProfile,
  logout,
} from "./services/auth.service";

import { getCourses } from "./services/course.service";

import {
  getMyEnrollments,
  enrollInCourse,
} from "./services/enrollment.service";

import { getLessonsByCourse } from "./services/lesson.service";

import {
  getCourseProgress,
  completeLesson,
} from "./services/progress.service";

import { clearAccessToken } from "./services/api";

import CourseReviews from "./components/CourseReviews";
import "./App.css";

// Extract enrollments from common API response structures.
const extractEnrollments = (response) => {
  const candidates = [
    response?.data?.enrollments,
    response?.data?.data?.enrollments,
    response?.enrollments,
    response?.data,
    response,
  ];

  return candidates.find(Array.isArray) || [];
};

// Extract lessons from API response.
const extractLessons = (response) => {
  const candidates = [
    response?.data?.lessons,
    response?.data?.data?.lessons,
    response?.lessons,
    response?.data,
    response,
  ];

  return candidates.find(Array.isArray) || [];
};

// Extract progress information.
const extractProgress = (response) => {
  return (
    response?.data?.progress ||
    response?.data?.data?.progress ||
    response?.progress ||
    response?.data?.data ||
    response?.data ||
    response ||
    {}
  );
};

// Get populated course information from an enrollment.
const getCourseFromEnrollment = (enrollment) => {
  if (enrollment?.course && typeof enrollment.course === "object") {
    return enrollment.course;
  }

  if (
    enrollment?.courseDetails &&
    typeof enrollment.courseDetails === "object"
  ) {
    return enrollment.courseDetails;
  }

  return null;
};

// Get course ID from an enrollment.
const getEnrollmentCourseId = (enrollment) => {
  if (typeof enrollment?.course === "string") {
    return enrollment.course;
  }

  return (
    enrollment?.course?._id ||
    enrollment?.courseDetails?._id ||
    enrollment?.courseId ||
    null
  );
};

// Get a lesson's ID.
const getLessonId = (lesson) => {
  return lesson?._id || lesson?.id || null;
};

// Get completed lesson IDs.
const getCompletedLessonIds = (progress) => {
  const completed =
    progress?.completedLessons ||
    progress?.data?.completedLessons ||
    [];

  if (!Array.isArray(completed)) return [];

  return completed.map((item) =>
    typeof item === "object"
      ? String(
          item?._id ||
            item?.lesson?._id ||
            item?.lesson ||
            ""
        )
      : String(item)
  );
};

function App() {
  // Authentication.
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Profile editing.
  const [editingProfile, setEditingProfile] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // Navigation.
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");

  // Courses.
  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState("");

  // Enrollments.
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [enrollmentsError, setEnrollmentsError] = useState("");

  // Enrollment button states.
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [enrollmentMessage, setEnrollmentMessage] = useState("");

  // Course Player.
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [lessonsError, setLessonsError] = useState("");
  const [courseProgress, setCourseProgress] = useState({});
  const [completingLesson, setCompletingLesson] = useState(false);
  const [lessonMessage, setLessonMessage] = useState("");

  // Progress Dashboard.
  const [progressByCourse, setProgressByCourse] = useState({});
  const [progressLoading, setProgressLoading] = useState(false);

  // Check authentication.
  useEffect(() => {
    const checkAuthentication = async () => {
      const token = sessionStorage.getItem("accessToken");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Authentication check failed:", error);
        clearAccessToken();
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // Fetch published courses.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        setCoursesError("");

        const response = await getCourses();

        if (!cancelled) {
          setAllCourses(
            Array.isArray(response?.data?.courses)
              ? response.data.courses
              : []
          );
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to fetch courses:", error);

        setCoursesError(
          error.response?.data?.message ||
            "Unable to load courses."
        );
      } finally {
        if (!cancelled) {
          setCoursesLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Fetch the logged-in user's enrollments.
  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const fetchEnrollments = async () => {
      try {
        setEnrollmentsLoading(true);
        setEnrollmentsError("");

        const response = await getMyEnrollments();

        if (!cancelled) {
          setMyEnrollments(extractEnrollments(response));
        }
      } catch (error) {
        if (cancelled) return;

        console.error("Enrollment fetch failed:", error);

        setEnrollmentsError(
          error.response?.data?.message ||
            "Unable to load your enrolled courses."
        );

        setMyEnrollments([]);
      } finally {
        if (!cancelled) {
          setEnrollmentsLoading(false);
        }
      }
    };

    fetchEnrollments();

    return () => {
      cancelled = true;
    };
  }, [user]);

  // Fetch real progress for every enrolled course.
  useEffect(() => {
    if (!user || enrollmentsLoading) return;

    let cancelled = false;

    const fetchAllProgress = async () => {
      setProgressLoading(true);

      try {
        const courseIds = [
          ...new Set(
            myEnrollments
              .map((enrollment) =>
                getEnrollmentCourseId(enrollment)
              )
              .filter(Boolean)
              .map(String)
          ),
        ];

        if (courseIds.length === 0) {
          if (!cancelled) {
            setProgressByCourse({});
          }
          return;
        }

        const results = await Promise.all(
          courseIds.map(async (courseId) => {
            try {
              const response = await getCourseProgress(courseId);

              return [
                courseId,
                extractProgress(response),
              ];
            } catch (error) {
              console.error(
                `Progress fetch failed for course ${courseId}:`,
                error
              );

              return [courseId, {}];
            }
          })
        );

        if (!cancelled) {
          setProgressByCourse(
            Object.fromEntries(results)
          );
        }
      } finally {
        if (!cancelled) {
          setProgressLoading(false);
        }
      }
    };

    fetchAllProgress();

    return () => {
      cancelled = true;
    };
  }, [user, myEnrollments, enrollmentsLoading]);

  // Load course lessons and progress when Course Player opens.
  useEffect(() => {
    if (activeNav !== "Course Player" || !activeCourseId) {
      return;
    }

    let cancelled = false;

    const fetchCourseContent = async () => {
      try {
        setLessonsLoading(true);
        setLessonsError("");
        setLessonMessage("");
        setLessons([]);
        setSelectedLesson(null);

        const [lessonsResponse, progressResponse] =
          await Promise.all([
            getLessonsByCourse(activeCourseId),
            getCourseProgress(activeCourseId),
          ]);

        if (cancelled) return;

        const fetchedLessons = extractLessons(lessonsResponse);
        const fetchedProgress = extractProgress(progressResponse);

        const publishedLessons = fetchedLessons.filter(
          (lesson) => lesson.isPublished !== false
        );

        publishedLessons.sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );

        setLessons(publishedLessons);
        setCourseProgress(fetchedProgress);
        setSelectedLesson(publishedLessons[0] || null);

        setProgressByCourse((previous) => ({
          ...previous,
          [String(activeCourseId)]: fetchedProgress,
        }));

        console.log("COURSE LESSONS:", publishedLessons);
        console.log("COURSE PROGRESS:", fetchedProgress);
      } catch (error) {
        if (cancelled) return;

        console.error("Course content loading failed:", error);

        setLessonsError(
          error.response?.data?.message ||
            "Unable to load course lessons. Please try again."
        );
      } finally {
        if (!cancelled) {
          setLessonsLoading(false);
        }
      }
    };

    fetchCourseContent();

    return () => {
      cancelled = true;
    };
  }, [activeNav, activeCourseId]);

  // Open a course in the Course Player.
  const handleContinueLearning = (enrollment) => {
    const courseId = getEnrollmentCourseId(enrollment);

    if (!courseId) {
      console.error("Course ID not found:", enrollment);
      setEnrollmentsError("Unable to identify this course.");
      return;
    }

    const course = getCourseFromEnrollment(enrollment);

    setActiveCourseId(String(courseId));
    setActiveCourse(course);
    setActiveNav("Course Player");
    setMobileMenu(false);
  };

  // Return to My Learning.
  const handleBackToLearning = () => {
    setActiveNav("My Learning");
    setSelectedLesson(null);
    setLessons([]);
    setLessonMessage("");
  };

  // Mark selected lesson as complete.
  const handleCompleteLesson = async () => {
    const lessonId = getLessonId(selectedLesson);

    if (!activeCourseId || !lessonId || completingLesson) {
      return;
    }

    const completedIds = getCompletedLessonIds(courseProgress);

    if (completedIds.includes(String(lessonId))) {
      setLessonMessage("This lesson is already completed.");
      return;
    }

    try {
      setCompletingLesson(true);
      setLessonMessage("");

      await completeLesson(activeCourseId, lessonId);

      const updatedProgress = await getCourseProgress(activeCourseId);
      const refreshedProgress = extractProgress(updatedProgress);

      setCourseProgress(refreshedProgress);

      setProgressByCourse((previous) => ({
        ...previous,
        [String(activeCourseId)]: refreshedProgress,
      }));

      setLessonMessage("Lesson completed successfully!");

      const enrollmentResponse = await getMyEnrollments();

      setMyEnrollments(extractEnrollments(enrollmentResponse));
    } catch (error) {
      console.error("Lesson completion failed:", error);

      setLessonMessage(
        error.response?.data?.message ||
          "Unable to complete this lesson. Please try again."
      );
    } finally {
      setCompletingLesson(false);
    }
  };

  // Enroll in a course.
  const handleEnroll = async (course) => {
    if (!course?._id || enrollingCourseId) return;

    const alreadyEnrolled = myEnrollments.some(
      (enrollment) =>
        String(getEnrollmentCourseId(enrollment)) ===
        String(course._id)
    );

    if (alreadyEnrolled) {
      setEnrollmentMessage(
        "You are already enrolled in this course."
      );
      setActiveNav("My Learning");
      return;
    }

    try {
      setEnrollingCourseId(course._id);
      setEnrollmentMessage("");
      setEnrollmentsError("");

      await enrollInCourse(course._id);

      const response = await getMyEnrollments();

      setMyEnrollments(extractEnrollments(response));

      setEnrollmentMessage(
        `Successfully enrolled in ${course.title}!`
      );

      setActiveNav("My Learning");
    } catch (error) {
      console.error("Course enrollment failed:", error);

      setEnrollmentMessage(
        error.response?.data?.message ||
          "Unable to enroll. Please try again."
      );
    } finally {
      setEnrollingCourseId(null);
    }
  };

  // Start editing the profile.
  const handleEditProfile = () => {
    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
    });

    setProfileMessage("");
    setProfileError("");
    setEditingProfile(true);
  };

  // Cancel profile editing.
  const handleCancelProfileEdit = () => {
    setEditingProfile(false);
    setProfileError("");
    setProfileMessage("");
  };

  // Save profile changes.
  const handleSaveProfile = async (event) => {
    event.preventDefault();

    try {
      setProfileLoading(true);
      setProfileError("");
      setProfileMessage("");

      const updatedUser = await updateProfile({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        bio: profileForm.bio.trim(),
      });

      setUser(updatedUser);
      setEditingProfile(false);
      setProfileMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);

      setProfileError(
        error.response?.data?.message ||
          "Unable to update profile. Please try again."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Successful login or registration.
  const handleAuthenticated = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  // Logout.
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      clearAccessToken();

      setUser(null);
      setAllCourses([]);
      setMyEnrollments([]);
      setActiveCourseId(null);
      setActiveCourse(null);
      setLessons([]);
      setSelectedLesson(null);
      setCourseProgress({});
      setProgressByCourse({});
      setProgressLoading(false);

      setCoursesError("");
      setEnrollmentsError("");
      setEnrollmentMessage("");

      setEditingProfile(false);
      setProfileMessage("");
      setProfileError("");

      setActiveNav("Dashboard");
    }
  };

  // Navigation.
  const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "My Learning", icon: BookOpen },
    { label: "Explore Courses", icon: GraduationCap },
    { label: "Progress", icon: BarChart3 },
  ];

  // Page variables.
  const isDashboard = activeNav === "Dashboard";
  const isMyLearning = activeNav === "My Learning";
  const isExploreCourses = activeNav === "Explore Courses";
  const isProgress = activeNav === "Progress";
  const isCoursePlayer = activeNav === "Course Player";

  // Search courses.
  const filteredCourses = allCourses.filter((course) =>
    (course.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Completed lessons from actual backend progress.
  const completedLessonsCount = myEnrollments.reduce(
    (total, enrollment) => {
      const courseId = getEnrollmentCourseId(enrollment);
      const progress =
        progressByCourse[String(courseId)] || {};

      return (
        total +
        getCompletedLessonIds(progress).length
      );
    },
    0
  );

  // Average progress across enrolled courses.
  const overallProgress =
    myEnrollments.length > 0
      ? Math.round(
          myEnrollments.reduce((total, enrollment) => {
            const courseId = getEnrollmentCourseId(enrollment);
            const progress =
              progressByCourse[String(courseId)] || {};

            return (
              total +
              (Number(progress.progressPercentage) || 0)
            );
          }, 0) / myEnrollments.length
        )
      : 0;

  const userInitial =
    user?.firstName?.charAt(0)?.toUpperCase() || "U";

  const currentCompletedIds =
    getCompletedLessonIds(courseProgress);

  const currentProgressPercentage = Math.min(
    100,
    Math.max(
      0,
      Number(
        courseProgress?.progressPercentage ??
          courseProgress?.data?.progressPercentage ??
          0
      )
    )
  );

  const isSelectedLessonCompleted =
    selectedLesson &&
    currentCompletedIds.includes(
      String(getLessonId(selectedLesson))
    );

  // Group lessons by module.
  const lessonGroups = lessons.reduce((groups, lesson) => {
    const moduleName = lesson.moduleTitle || "Course Lessons";

    if (!groups[moduleName]) {
      groups[moduleName] = [];
    }

    groups[moduleName].push(lesson);

    return groups;
  }, {});

  // Authentication loading screen.
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: "18px",
          color: "#5944bd",
        }}
      >
        Loading LearnSphere...
      </div>
    );
  }

  // Login/register screen.
  if (!user) {
    return <Auth onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-shell">
      {mobileMenu && (
        <button
          className="mobile-overlay"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <GraduationCap size={25} />
          </div>

          <span>
            Learn<span className="brand-highlight">Sphere</span>
          </span>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-label">MENU</div>

        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activeNav === label ? "active" : ""
              }`}
              onClick={() => {
                setActiveNav(label);
                setMobileMenu(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>

              {label === "My Learning" && (
                <span className="nav-count">
                  {myEnrollments.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-label tools-label">
          PREFERENCES
        </div>

        <nav className="nav-list">
          <button
            className={`nav-item ${
              activeNav === "Settings" ? "active" : ""
            }`}
            onClick={() => {
              setActiveNav("Settings");
              setMobileMenu(false);
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <button
            className={`nav-item ${
              activeNav === "Help & Support" ? "active" : ""
            }`}
            onClick={() => {
              setActiveNav("Help & Support");
              setMobileMenu(false);
            }}
          >
            <CircleHelp size={19} />
            <span>Help & Support</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">✦</div>
            <h4>Keep growing!</h4>
            <p>
              Small steps every day lead to big achievements.
            </p>

            <button
              onClick={() => setActiveNav("Explore Courses")}
            >
              Explore courses <ChevronRight size={15} />
            </button>
          </div>

          <button
            className="profile-mini"
            onClick={handleLogout}
            title="Logout"
          >
            <div className="avatar">{userInitial}</div>

            <div className="profile-info">
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <span>{user.role} account</span>
            </div>

            <LogOut size={17} className="logout-icon" />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="breadcrumb">
                Pages / {activeNav}
              </span>
              <h2>{activeNav}</h2>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} />

              <input
                type="search"
                placeholder="Search courses..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              <kbd>⌘ K</kbd>
            </label>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="avatar top-avatar">
              {userInitial}
            </div>
          </div>
        </header>

        <div className="dashboard-content">
          {/* COURSE PLAYER */}
          {isCoursePlayer && (
            <section className="section-block">
              <button
                className="text-link"
                onClick={handleBackToLearning}
                style={{ marginBottom: "22px" }}
              >
                <ArrowLeft size={17} />
                Back to My Learning
              </button>

              <span className="eyebrow">
                YOUR LEARNING SPACE
              </span>

              <h1>
                {activeCourse?.title || "Course Player"}
              </h1>

              <p>
                Learn at your own pace and track your progress.
              </p>

              {lessonsLoading ? (
                <p style={{ marginTop: "25px" }}>
                  Loading course lessons...
                </p>
              ) : lessonsError ? (
                <div className="learning-card">
                  <div className="learning-card-body">
                    <p>{lessonsError}</p>

                    <button
                      className="continue-button"
                      onClick={() => {
                        setActiveNav("My Learning");
                        setTimeout(() => {
                          setActiveNav("Course Player");
                        }, 0);
                      }}
                    >
                      Return to course
                    </button>
                  </div>
                </div>
              ) : lessons.length === 0 ? (
                <div className="learning-card">
                  <div className="learning-card-body">
                    <h3>No lessons available yet</h3>
                    <p>
                      The instructor has not published any lessons
                      for this course.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="learning-card"
                    style={{ marginTop: "24px" }}
                  >
                    <div className="learning-card-body">
                      <div className="progress-meta">
                        <strong>Course progress</strong>
                        <strong>
                          {currentProgressPercentage}%
                        </strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${currentProgressPercentage}%`,
                          }}
                        />
                      </div>

                      <p>
                        {currentCompletedIds.length} of{" "}
                        {lessons.length} lessons completed
                      </p>
                    </div>
                  </div>

                  <div
                    className="course-player-layout"
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "minmax(240px, 0.8fr) minmax(0, 2fr)",
                      gap: "24px",
                      marginTop: "24px",
                      alignItems: "start",
                    }}
                  >
                    {/* Lesson list */}
                    <div className="learning-card">
                      <div className="learning-card-body">
                        <h3>Course Content</h3>

                        {Object.entries(lessonGroups).map(
                          ([moduleName, moduleLessons]) => (
                            <div
                              key={moduleName}
                              style={{ marginTop: "20px" }}
                            >
                              <h4>{moduleName}</h4>

                              {moduleLessons.map(
                                (lesson, index) => {
                                  const lessonId =
                                    getLessonId(lesson);

                                  const isCompleted =
                                    currentCompletedIds.includes(
                                      String(lessonId)
                                    );

                                  const isSelected =
                                    String(
                                      getLessonId(selectedLesson)
                                    ) === String(lessonId);

                                  return (
                                    <button
                                      key={lessonId || index}
                                      onClick={() => {
                                        setSelectedLesson(lesson);
                                        setLessonMessage("");
                                      }}
                                      style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "13px 10px",
                                        marginTop: "8px",
                                        borderRadius: "10px",
                                        border: isSelected
                                          ? "1px solid #7660d9"
                                          : "1px solid #eeeeee",
                                        background: isSelected
                                          ? "#f4f1ff"
                                          : "#ffffff",
                                        textAlign: "left",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {isCompleted ? (
                                        <CheckCircle
                                          size={18}
                                          color="#16a34a"
                                        />
                                      ) : (
                                        <Play size={17} />
                                      )}

                                      <span style={{ flex: 1 }}>
                                        {lesson.title}
                                      </span>
                                    </button>
                                  );
                                }
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Selected lesson content */}
                    <div className="learning-card">
                      <div className="learning-card-body">
                        {selectedLesson ? (
                          <>
                            <span className="eyebrow">
                              {selectedLesson.moduleTitle ||
                                "COURSE LESSON"}
                            </span>

                            <h2 style={{ marginTop: "10px" }}>
                              {selectedLesson.title}
                            </h2>

                            <p>
                              {selectedLesson.description ||
                                "Start learning this lesson."}
                            </p>

                            {selectedLesson.durationMinutes && (
                              <p>
                                <Clock3 size={15} />{" "}
                                {selectedLesson.durationMinutes} minutes
                              </p>
                            )}

                            {selectedLesson.videoUrl && (
                              <div style={{ marginTop: "20px" }}>
                                <video
                                  controls
                                  style={{
                                    width: "100%",
                                    maxHeight: "420px",
                                    borderRadius: "12px",
                                    background: "#111",
                                  }}
                                  src={selectedLesson.videoUrl}
                                >
                                  Your browser does not support
                                  video playback.
                                </video>
                              </div>
                            )}

                            <div
                              style={{
                                marginTop: "24px",
                                lineHeight: 1.8,
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {selectedLesson.content ||
                                "No lesson text content has been added yet."}
                            </div>

                            <button
                              className="continue-button"
                              onClick={handleCompleteLesson}
                              disabled={
                                completingLesson ||
                                Boolean(isSelectedLessonCompleted)
                              }
                              style={{ marginTop: "25px" }}
                            >
                              {completingLesson
                                ? "Saving progress..."
                                : isSelectedLessonCompleted
                                  ? "Lesson completed"
                                  : "Mark as Complete"}

                              <CheckCircle size={17} />
                            </button>

                            {lessonMessage && (
                              <p
                                role="status"
                                style={{ marginTop: "15px" }}
                              >
                                {lessonMessage}
                              </p>
                            )}
                          </>
                        ) : (
                          <p>
                            Select a lesson to start learning.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Course Reviews */}
          {isCoursePlayer && activeCourseId && (
            <CourseReviews
              courseId={activeCourseId}
              user={user}
            />
          )}

          {/* Dashboard welcome section */}
          {isDashboard && (
            <section className="welcome-section">
              <div>
                <span className="eyebrow">
                  YOUR LEARNING SPACE
                </span>

                <h1>
                  Welcome back, {user.firstName}! 👋
                </h1>

                <p>
                  Keep learning, keep growing. You're doing great!
                </p>
              </div>

              <div className="date-chip">
                <Clock3 size={16} />
                Make today count
              </div>
            </section>
          )}

          {/* Dashboard statistics */}
          {isDashboard && (
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple-bg">
                  <BookOpen size={21} />
                </div>

                <div>
                  <span>Enrolled courses</span>
                  <strong>
                    {enrollmentsLoading
                      ? "..."
                      : String(myEnrollments.length).padStart(2, "0")}
                  </strong>
                  <small>Courses in your library</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon green-bg">
                  <GraduationCap size={21} />
                </div>

                <div>
                  <span>Completed lessons</span>
                  <strong>
                    {enrollmentsLoading || progressLoading
                      ? "..."
                      : completedLessonsCount}
                  </strong>
                  <small>Keep up the momentum</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange-bg">
                  <Flame size={21} />
                </div>

                <div>
                  <span>Learning streak</span>
                  <strong>—</strong>
                  <small>Streak tracking coming soon</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue-bg">
                  <BarChart3 size={21} />
                </div>

                <div>
                  <span>Overall progress</span>
                  <strong>
                    {enrollmentsLoading || progressLoading
                      ? "..."
                      : `${overallProgress}%`}
                  </strong>
                  <small>Across your courses</small>
                </div>
              </div>
            </section>
          )}

          {/* My Learning and Dashboard enrolled courses */}
          {(isDashboard || isMyLearning) && (
            <section className="section-block">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    {isMyLearning
                      ? "YOUR COURSES"
                      : "PICK UP WHERE YOU LEFT OFF"}
                  </span>

                  <h2>
                    {isMyLearning
                      ? "My Enrolled Courses"
                      : "Continue learning"}
                  </h2>
                </div>

                {isDashboard && (
                  <button
                    className="text-link"
                    onClick={() => setActiveNav("My Learning")}
                  >
                    View all courses <ChevronRight size={17} />
                  </button>
                )}
              </div>

              {enrollmentsLoading ? (
                <p>Loading your enrolled courses...</p>
              ) : enrollmentsError ? (
                <p className="empty-search">
                  {enrollmentsError}
                </p>
              ) : myEnrollments.length > 0 ? (
                <div className="learning-grid">
                  {myEnrollments.map((enrollment, index) => {
                    const course =
                      getCourseFromEnrollment(enrollment);

                    const courseId =
                      getEnrollmentCourseId(enrollment);

                    const courseProgressData =
                      progressByCourse[String(courseId)] || {};

                    const progress = Math.min(
                      100,
                      Math.max(
                        0,
                        Number(
                          courseProgressData.progressPercentage
                        ) || 0
                      )
                    );

                    const courseTitle =
                      course?.title || "Enrolled course";

                    const instructor = course?.instructor;

                    const instructorName =
                      typeof instructor === "object" && instructor
                        ? `${instructor.firstName || ""} ${
                            instructor.lastName || ""
                          }`.trim()
                        : "LearnSphere Academy";

                    const completedCount =
                      getCompletedLessonIds(
                        courseProgressData
                      ).length;

                    return (
                      <article
                        className="learning-card"
                        key={enrollment._id || course?._id || index}
                      >
                        <div className="course-cover purple">
                          <span className="course-emoji">📚</span>

                          <span className="cover-label">
                            {course?.category || "Learning"}
                          </span>

                          <button
                            className="play-button"
                            aria-label={`Continue ${courseTitle}`}
                            onClick={() =>
                              handleContinueLearning(enrollment)
                            }
                          >
                            <Play
                              size={19}
                              fill="currentColor"
                            />
                          </button>
                        </div>

                        <div className="learning-card-body">
                          <span className="instructor-name">
                            {instructorName ||
                              "LearnSphere Academy"}
                          </span>

                          <h3>{courseTitle}</h3>

                          <div className="progress-meta">
                            <span>
                              {completedCount} completed lessons
                            </span>
                            <strong>{progress}%</strong>
                          </div>

                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <button
                            className="continue-button"
                            onClick={() =>
                              handleContinueLearning(enrollment)
                            }
                          >
                            Continue learning{" "}
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="empty-search">
                  You haven't enrolled in any courses yet.
                  Explore courses to get started!
                </p>
              )}
            </section>
          )}

          {/* Explore Courses and Dashboard popular courses */}
          {(isDashboard || isExploreCourses) && (
            <section className="section-block popular-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    {isExploreCourses
                      ? "FIND YOUR NEXT COURSE"
                      : "GROW YOUR SKILLS"}
                  </span>

                  <h2>
                    {isExploreCourses
                      ? "Explore All Courses"
                      : "Explore popular courses"}
                  </h2>
                </div>

                {isDashboard && (
                  <button
                    className="text-link"
                    onClick={() =>
                      setActiveNav("Explore Courses")
                    }
                  >
                    Explore all <ChevronRight size={17} />
                  </button>
                )}
              </div>

              <div className="popular-grid">
                {coursesLoading ? (
                  <p>Loading courses...</p>
                ) : coursesError ? (
                  <p className="empty-search">
                    {coursesError}
                  </p>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const alreadyEnrolled = myEnrollments.some(
                      (enrollment) =>
                        String(
                          getEnrollmentCourseId(enrollment)
                        ) === String(course._id)
                    );

                    return (
                      <article
                        className="popular-card"
                        key={course._id}
                      >
                        <div className="popular-cover purple">
                          <span>📚</span>

                          <span className="free-tag">
                            {Number(course.price || 0) === 0
                              ? "Free"
                              : `₹${course.price}`}
                          </span>
                        </div>

                        <div className="popular-body">
                          <span className="category-label">
                            {course.category}
                          </span>

                          <h3>{course.title}</h3>

                          <p>{course.level}</p>

                          <button
                            className="enroll-button"
                            onClick={() =>
                              handleEnroll(course)
                            }
                            disabled={
                              enrollingCourseId === course._id ||
                              alreadyEnrolled
                            }
                          >
                            {enrollingCourseId === course._id
                              ? "Enrolling..."
                              : alreadyEnrolled
                                ? "Enrolled"
                                : "Enroll now"}

                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="empty-search">
                    No courses available.
                  </p>
                )}
              </div>

              {enrollmentMessage && (
                <p
                  role="status"
                  className="enrollment-message"
                >
                  {enrollmentMessage}
                </p>
              )}
            </section>
          )}

          {/* Progress page */}
          {isProgress && (
            <section className="section-block">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    YOUR PERFORMANCE
                  </span>
                  <h2>Learning Progress</h2>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon purple-bg">
                    <BookOpen size={21} />
                  </div>

                  <div>
                    <span>Enrolled courses</span>
                    <strong>
                      {enrollmentsLoading
                        ? "..."
                        : myEnrollments.length}
                    </strong>
                    <small>Your active courses</small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon green-bg">
                    <GraduationCap size={21} />
                  </div>

                  <div>
                    <span>Completed lessons</span>
                    <strong>
                      {enrollmentsLoading || progressLoading
                        ? "..."
                        : completedLessonsCount}
                    </strong>
                    <small>Lessons completed</small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue-bg">
                    <BarChart3 size={21} />
                  </div>

                  <div>
                    <span>Overall progress</span>
                    <strong>
                      {enrollmentsLoading || progressLoading
                        ? "..."
                        : `${overallProgress}%`}
                    </strong>
                    <small>Across your courses</small>
                  </div>
                </div>
              </div>

              <h3 style={{ marginTop: "28px" }}>
                Course-wise progress
              </h3>

              {enrollmentsLoading || progressLoading ? (
                <p>Loading your progress...</p>
              ) : enrollmentsError ? (
                <p className="empty-search">
                  {enrollmentsError}
                </p>
              ) : myEnrollments.length === 0 ? (
                <p className="empty-search">
                  Enroll in a course to start tracking your progress.
                </p>
              ) : (
                <div className="learning-grid">
                  {myEnrollments.map((enrollment, index) => {
                    const course =
                      getCourseFromEnrollment(enrollment);

                    const courseId =
                      getEnrollmentCourseId(enrollment);

                    const courseProgressData =
                      progressByCourse[String(courseId)] || {};

                    const progress = Math.min(
                      100,
                      Math.max(
                        0,
                        Number(
                          courseProgressData.progressPercentage
                        ) || 0
                      )
                    );

                    const completedCount =
                      getCompletedLessonIds(
                        courseProgressData
                      ).length;

                    return (
                      <article
                        className="learning-card"
                        key={enrollment._id || index}
                      >
                        <div className="learning-card-body">
                          <span className="instructor-name">
                            {course?.category || "Learning"}
                          </span>

                          <h3>
                            {course?.title || "Enrolled course"}
                          </h3>

                          <div className="progress-meta">
                            <span>Course completion</span>
                            <strong>{progress}%</strong>
                          </div>

                          <div className="progress-track">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>

                          <p className="instructor-name">
                            {completedCount} lessons completed
                          </p>

                          <button
                            className="continue-button"
                            onClick={() =>
                              handleContinueLearning(enrollment)
                            }
                          >
                            Continue learning{" "}
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Settings page */}
          {activeNav === "Settings" && (
            <section className="section-block">
              <span className="eyebrow">
                ACCOUNT PREFERENCES
              </span>

              <h2>Settings</h2>
              <p>Manage your LearnSphere account.</p>

              <div className="learning-card">
                <div className="learning-card-body">
                  <h3>Profile Information</h3>

                  {profileMessage && (
                    <p
                      role="status"
                      style={{ color: "green" }}
                    >
                      {profileMessage}
                    </p>
                  )}

                  {profileError && (
                    <p
                      role="alert"
                      style={{ color: "red" }}
                    >
                      {profileError}
                    </p>
                  )}

                  {editingProfile ? (
                    <form onSubmit={handleSaveProfile}>
                      <label htmlFor="profile-first-name">
                        First Name
                      </label>

                      <input
                        id="profile-first-name"
                        type="text"
                        value={profileForm.firstName}
                        onChange={(event) =>
                          setProfileForm((previous) => ({
                            ...previous,
                            firstName: event.target.value,
                          }))
                        }
                        required
                        maxLength={50}
                      />

                      <label htmlFor="profile-last-name">
                        Last Name
                      </label>

                      <input
                        id="profile-last-name"
                        type="text"
                        value={profileForm.lastName}
                        onChange={(event) =>
                          setProfileForm((previous) => ({
                            ...previous,
                            lastName: event.target.value,
                          }))
                        }
                        required
                        maxLength={50}
                      />

                      <label htmlFor="profile-bio">
                        Bio
                      </label>

                      <textarea
                        id="profile-bio"
                        value={profileForm.bio}
                        onChange={(event) =>
                          setProfileForm((previous) => ({
                            ...previous,
                            bio: event.target.value,
                          }))
                        }
                        rows={3}
                        maxLength={500}
                        placeholder="Tell us about yourself"
                      />

                      <button
                        type="submit"
                        className="continue-button"
                        disabled={profileLoading}
                      >
                        {profileLoading
                          ? "Saving..."
                          : "Save Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelProfileEdit}
                        disabled={profileLoading}
                        style={{ marginLeft: "10px" }}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <p>
                        Name: {user.firstName} {user.lastName}
                      </p>

                      <p>Email: {user.email}</p>

                      <p>Account type: {user.role}</p>

                      <p>
                        Bio: {user.bio || "No bio added yet."}
                      </p>

                      <button
                        className="continue-button"
                        onClick={handleEditProfile}
                      >
                        Edit Profile
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Help and Support page */}
          {activeNav === "Help & Support" && (
            <section className="section-block">
              <span className="eyebrow">
                WE ARE HERE TO HELP
              </span>

              <h2>Help & Support</h2>

              <div className="learning-card">
                <div className="learning-card-body">
                  <h3>Need assistance?</h3>

                  <p>
                    Welcome to LearnSphere support.
                    More support features are coming soon.
                  </p>
                </div>
              </div>
            </section>
          )}

          <footer className="footer">
            <span>
              © 2026 LearnSphere. Learn without limits.
            </span>

            <span>
              Made for curious minds{" "}
              <span className="footer-heart">♥</span>
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;