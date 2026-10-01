/* =========================================================
   NEXUS DASHBOARD
   VERSION: 2026-10-01
========================================================= */

console.log("NEXUS DASHBOARD JS v20261001 LOADED");


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://rjtzurluhylqvfbwajwv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =========================================================
   DOM
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const sidebarOverlay =
    document.getElementById("sidebarOverlay");

const menuToggle =
    document.getElementById("menuToggle");

const closeSidebar =
    document.getElementById("closeSidebar");

const logoutBtn =
    document.getElementById("logoutBtn");

const notificationBtn =
    document.getElementById("notificationBtn");

const notificationCount =
    document.getElementById("notificationCount");

const headerUserName =
    document.getElementById("headerUserName");

const headerUserRole =
    document.getElementById("headerUserRole");

const userAvatar =
    document.getElementById("userAvatar");

const welcomeTitle =
    document.getElementById("welcomeTitle");

const enrolledCourses =
    document.getElementById("enrolledCourses");

const averageProgress =
    document.getElementById("averageProgress");

const completedCourses =
    document.getElementById("completedCourses");

const quizAttempts =
    document.getElementById("quizAttempts");

const progressCourses =
    document.getElementById("progressCourses");

const completedLessons =
    document.getElementById("completedLessons");

const progressQuizzes =
    document.getElementById("progressQuizzes");

const overallProgress =
    document.getElementById("overallProgress");

const progressCircle =
    document.querySelector(".progress-circle");

const continueLearning =
    document.getElementById("continueLearning");

const recentActivity =
    document.getElementById("recentActivity");

const bookmarksList =
    document.getElementById("bookmarksList");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   STATE
========================================================= */

let currentUser = null;
let currentProfile = null;

let userEnrollments = [];
let userLessonProgress = [];
let userQuizAttempts = [];
let userBookmarks = [];
let userNotifications = [];


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Nexus dashboard DOM ready."
        );


        if (currentYear) {

            currentYear.textContent =
                new Date().getFullYear();

        }


        setupMobileSidebar();
        setupNavigation();
        setupQuickActions();
        setupNotifications();
        setupMarquee();

        loadDashboard();

    }
);


/* =========================================================
   DASHBOARD LOADER
========================================================= */

async function loadDashboard() {

    try {

        console.log(
            "Nexus: checking session..."
        );


        const {
            data,
            error
        } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            redirectToLogin();
            return;

        }


        currentUser =
            data?.session?.user || null;


        if (!currentUser) {

            console.warn(
                "No active Nexus session."
            );

            redirectToLogin();
            return;

        }


        console.log(
            "Nexus user:",
            currentUser.id
        );


        await loadProfile();

        await loadDashboardData();

        renderUser();

        renderStatistics();

        renderProgress();

        renderContinueLearning();

        renderRecentActivity();

        renderBookmarks();

        renderNotifications();


        showToast(
            "Nexus dashboard connected.",
            "success"
        );


        console.log(
            "Nexus dashboard fully loaded."
        );

    } catch (error) {

        console.error(
            "Dashboard startup error:",
            error
        );

        showToast(
            "Nexus dashboard encountered an error.",
            "error"
        );

    }

}


/* =========================================================
   PROFILE
========================================================= */

async function loadProfile() {

    if (!currentUser) return;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profiles")
                .select("*")
                .eq(
                    "id",
                    currentUser.id
                )
                .maybeSingle();


        if (error) {

            console.error(
                "Profile error:",
                error
            );

            currentProfile = null;
            return;

        }


        currentProfile =
            data || null;


        console.log(
            "Profile loaded:",
            currentProfile
        );

    } catch (error) {

        console.error(
            "Profile exception:",
            error
        );

        currentProfile = null;

    }

}


/* =========================================================
   DASHBOARD DATA
========================================================= */

async function loadDashboardData() {

    if (!currentUser) return;


    /* Enrollments */

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("enrollments")
                .select("*")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "enrolled_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Enrollments error:",
                error
            );

            userEnrollments = [];

        } else {

            userEnrollments =
                data || [];

        }

    } catch (error) {

        console.error(
            "Enrollments exception:",
            error
        );

        userEnrollments = [];

    }


    /* Lesson progress */

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("lesson_progress")
                .select("*")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "updated_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Lesson progress error:",
                error
            );

            userLessonProgress = [];

        } else {

            userLessonProgress =
                data || [];

        }

    } catch (error) {

        console.error(
            "Lesson progress exception:",
            error
        );

        userLessonProgress = [];

    }


    /* Quiz attempts */

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("quiz_attempts")
                .select("*")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "started_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Quiz attempts error:",
                error
            );

            userQuizAttempts = [];

        } else {

            userQuizAttempts =
                data || [];

        }

    } catch (error) {

        console.error(
            "Quiz attempts exception:",
            error
        );

        userQuizAttempts = [];

    }


    /* Bookmarks */

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("bookmarks")
                .select("*")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "Bookmarks error:",
                error
            );

            userBookmarks = [];

        } else {

            userBookmarks =
                data || [];

        }

    } catch (error) {

        console.error(
            "Bookmarks exception:",
            error
        );

        userBookmarks = [];

    }


    /* Notifications */

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("notifications")
                .select("*")
                .eq(
                    "user_id",
                    currentUser.id
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                )
                .limit(20);


        if (error) {

            console.error(
                "Notifications error:",
                error
            );

            userNotifications = [];

        } else {

            userNotifications =
                data || [];

        }

    } catch (error) {

        console.error(
            "Notifications exception:",
            error
        );

        userNotifications = [];

    }

}


/* =========================================================
   USER
========================================================= */

function renderUser() {

    if (!currentUser) return;


    const metadata =
        currentUser.user_metadata || {};


    const profileName =
        currentProfile?.full_name || "";


    const metadataName =
        metadata.full_name ||
        metadata.name ||
        "";


    const emailName =
        currentUser.email
            ? currentUser.email.split("@")[0]
            : "Nexus User";


    const fullName =
        profileName ||
        metadataName ||
        emailName ||
        "Nexus User";


    const role =
        currentProfile?.role ||
        "student";


    if (headerUserName) {

        headerUserName.textContent =
            fullName;

    }


    if (headerUserRole) {

        headerUserRole.textContent =
            formatRole(role);

    }


    if (welcomeTitle) {

        const firstName =
            fullName
                .trim()
                .split(/\s+/)[0] ||
                "there";


        welcomeTitle.textContent =
            `Welcome back, ${firstName}! 👋`;

    }


    if (userAvatar) {

        userAvatar.textContent =
            getInitials(fullName);

    }

}


/* =========================================================
   STATISTICS
========================================================= */

function renderStatistics() {

    const total =
        userEnrollments.length;


    const completed =
        userEnrollments.filter(
            item =>
                item.status === "completed" ||
                Number(
                    item.progress_percent || 0
                ) >= 100
        ).length;


    const values =
        userEnrollments.map(
            item =>
                Number(
                    item.progress_percent || 0
                )
        );


    const average =
        values.length
            ? Math.round(
                values.reduce(
                    (a, b) => a + b,
                    0
                ) / values.length
            )
            : 0;


    enrolledCourses.textContent =
        total;

    completedCourses.textContent =
        completed;

    averageProgress.textContent =
        Math.min(
            100,
            Math.max(
                0,
                average
            )
        );

    quizAttempts.textContent =
        userQuizAttempts.length;

}


/* =========================================================
   PROGRESS
========================================================= */

function renderProgress() {

    const total =
        userEnrollments.length;


    const lessons =
        userLessonProgress.filter(
            item =>
                item.completed === true
        ).length;


    const values =
        userEnrollments.map(
            item =>
                Number(
                    item.progress_percent || 0
                )
        );


    const average =
        values.length
            ? Math.round(
                values.reduce(
                    (a, b) => a + b,
                    0
                ) / values.length
            )
            : 0;


    progressCourses.textContent =
        total;


    completedLessons.textContent =
        lessons;


    progressQuizzes.textContent =
        userQuizAttempts.length;


    overallProgress.textContent =
        `${average}%`;


    updateProgressCircle(
        average
    );

}


/* =========================================================
   PROGRESS CIRCLE
========================================================= */

function updateProgressCircle(
    value
) {

    if (!progressCircle) return;


    const safe =
        Math.max(
            0,
            Math.min(
                100,
                Number(value) || 0
            )
        );


    const degrees =
        safe * 3.6;


    progressCircle.style.background =
        `conic-gradient(
            #8b5cf6 0deg,
            #22d3ee ${degrees}deg,
            rgba(255,255,255,0.07)
            ${degrees}deg,
            rgba(255,255,255,0.07)
            360deg
        )`;

}


/* =========================================================
   CONTINUE LEARNING
========================================================= */

function renderContinueLearning() {

    if (!continueLearning) return;


    if (!userEnrollments.length) {

        continueLearning.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ▶
                </div>

                <h4>
                    No courses yet
                </h4>

                <p>
                    Enroll in a course to start
                    your learning journey.
                </p>

                <a
                    href="#"
                    id="emptyExploreBtn">

                    Explore Courses →

                </a>

            </div>

        `;


        setupPlaceholderLink(
            "emptyExploreBtn",
            "The Courses page is coming next."
        );


        return;

    }


    const enrollment =
        userEnrollments[0];


    const progress =
        Math.round(
            Number(
                enrollment.progress_percent || 0
            )
        );


    const courseId =
        enrollment.course_id
            ? String(
                enrollment.course_id
            ).substring(0, 8)
            : "Course";


    continueLearning.innerHTML = `

        <div class="continue-course">

            <div class="continue-course-icon">
                📚
            </div>

            <div class="continue-course-info">

                <span class="course-mini-label">
                    ENROLLED COURSE
                </span>

                <h4>
                    Course ${escapeHTML(courseId)}
                </h4>

                <div class="course-progress-bar">

                    <span
                        style="width:${progress}%">
                    </span>

                </div>

                <small>
                    ${progress}% complete
                </small>

            </div>

            <button
                type="button"
                class="continue-course-button"
                id="continueCourseButton">

                Continue →

            </button>

        </div>

    `;


    const button =
        document.getElementById(
            "continueCourseButton"
        );


    if (button) {

        button.addEventListener(
            "click",
            () => {

                showToast(
                    "The course learning page is coming next.",
                    "info"
                );

            }
        );

    }

}


/* =========================================================
   RECENT ACTIVITY
========================================================= */

function renderRecentActivity() {

    if (!recentActivity) return;


    const activities = [];


    userLessonProgress
        .slice(0, 5)
        .forEach(item => {

            activities.push({

                icon:
                    item.completed
                        ? "✓"
                        : "▶",

                title:
                    item.completed
                        ? "Lesson completed"
                        : "Lesson in progress",

                date:
                    item.updated_at ||
                    item.started_at

            });

        });


    userQuizAttempts
        .slice(0, 5)
        .forEach(item => {

            activities.push({

                icon: "📝",

                title:
                    "Quiz attempted",

                date:
                    item.completed_at ||
                    item.started_at

            });

        });


    activities.sort(
        (a, b) =>
            new Date(b.date || 0) -
            new Date(a.date || 0)
    );


    const latest =
        activities.slice(0, 5);


    if (!latest.length) {

        recentActivity.innerHTML = `

            <div class="empty-state compact">

                <div class="empty-icon">
                    ◷
                </div>

                <h4>
                    No recent activity
                </h4>

                <p>
                    Your learning activity will
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    recentActivity.innerHTML = `

        <div class="activity-list">

            ${latest.map(item => `

                <div class="activity-item">

                    <div class="activity-icon">
                        ${item.icon}
                    </div>

                    <div class="activity-info">

                        <strong>
                            ${escapeHTML(
                                item.title
                            )}
                        </strong>

                        <small>
                            ${formatDate(
                                item.date
                            )}
                        </small>

                    </div>

                </div>

            `).join("")}

        </div>

    `;

}


/* =========================================================
   BOOKMARKS
========================================================= */

function renderBookmarks() {

    if (!bookmarksList) return;


    if (!userBookmarks.length) 