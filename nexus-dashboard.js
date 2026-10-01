/* =========================================================
   NEXUS DASHBOARD
   Final synchronized dashboard controller
   ========================================================= */

const SUPABASE_URL = "https://rjtzurluhylqvfbwajwv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_gYy7X9szI2XlzIwasv1_XA_qg5gJnsK";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const menuToggle = document.getElementById("menuToggle");
const closeSidebar = document.getElementById("closeSidebar");

const logoutBtn = document.getElementById("logoutBtn");

const headerUserName = document.getElementById("headerUserName");
const headerUserRole = document.getElementById("headerUserRole");
const userAvatar = document.getElementById("userAvatar");
const welcomeTitle = document.getElementById("welcomeTitle");

const notificationBtn = document.getElementById("notificationBtn");
const notificationCount = document.getElementById("notificationCount");

const enrolledCourses = document.getElementById("enrolledCourses");
const averageProgress = document.getElementById("averageProgress");
const completedCourses = document.getElementById("completedCourses");
const quizAttempts = document.getElementById("quizAttempts");

const overallProgress = document.getElementById("overallProgress");
const progressCourses = document.getElementById("progressCourses");
const completedLessons = document.getElementById("completedLessons");
const progressQuizzes = document.getElementById("progressQuizzes");

const continueLearning = document.getElementById("continueLearning");
const recentActivity = document.getElementById("recentActivity");
const bookmarksList = document.getElementById("bookmarksList");

const browseCoursesBtn = document.getElementById("browseCoursesBtn");
const viewCoursesBtn = document.getElementById("viewCoursesBtn");
const emptyExploreBtn = document.getElementById("emptyExploreBtn");
const viewBookmarksBtn = document.getElementById("viewBookmarksBtn");

const currentYear = document.getElementById("currentYear");

const nexusMarquee = document.getElementById("nexusMarquee");


/* =========================================================
   GLOBAL DASHBOARD DATA
   ========================================================= */

let currentUser = null;
let currentProfile = null;

let dashboardData = {
    enrollments: [],
    progress: [],
    quizzes: [],
    bookmarks: [],
    notifications: []
};


/* =========================================================
   START DASHBOARD
   ========================================================= */

document.addEventListener("DOMContentLoaded", async () => {

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    createMarquee();

    setupSidebar();

    setupNavigation();

    setupDashboardButtons();

    setupNotificationButton();

    setupLogout();

    await initializeDashboard();

});


/* =========================================================
   INITIALIZE DASHBOARD
   ========================================================= */

async function initializeDashboard() {

    try {

        console.log("Nexus dashboard: checking session...");

        const {
            data,
            error
        } = await supabaseClient.auth.getUser();

        if (error) {
            console.error(
                "Nexus dashboard authentication error:",
                error
            );

            redirectToLogin();
            return;
        }

        if (!data || !data.user) {

            console.warn(
                "Nexus dashboard: no authenticated user."
            );

            redirectToLogin();
            return;
        }

        currentUser = data.user;

        console.log(
            "Nexus dashboard: authenticated user:",
            currentUser.email
        );


        await loadUserProfile();

        await loadDashboardData();

        renderDashboard();

        console.log(
            "Nexus dashboard initialized successfully."
        );

    } catch (error) {

        console.error(
            "Nexus dashboard initialization error:",
            error
        );

        /*
           We do not immediately redirect here because a
           temporary database problem should not destroy a
           valid login session.
        */

        showToast(
            "Dashboard loaded, but some information could not be retrieved.",
            "warning"
        );

        renderFallbackUser();

    }

}


/* =========================================================
   LOAD USER PROFILE
   ========================================================= */

async function loadUserProfile() {

    if (!currentUser) return;


    /*
       First try the Nexus profiles table.
    */

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select("id, full_name, role")
            .eq("id", currentUser.id)
            .maybeSingle();


        if (!error && data) {

            currentProfile = data;

            console.log(
                "Nexus profile loaded:",
                currentProfile
            );

            renderUserInformation();

            return;
        }


        if (error) {

            console.warn(
                "Nexus profile query:",
                error.message
            );

        }

    } catch (error) {

        console.warn(
            "Profile loading exception:",
            error
        );

    }


    /*
       Fallback to Supabase Auth metadata.
       This prevents "Loading..." from remaining on
       the dashboard even if the profile query fails.
    */

    currentProfile = {
        id: currentUser.id,
        full_name:
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            currentUser.email?.split("@")[0] ||
            "Nexus User",
        role: "student"
    };

    renderUserInformation();

}


/* =========================================================
   RENDER USER INFORMATION
   ========================================================= */

function renderUserInformation() {

    const name =
        currentProfile?.full_name ||
        currentUser?.user_metadata?.full_name ||
        currentUser?.email?.split("@")[0] ||
        "Nexus User";

    const role =
        currentProfile?.role ||
        "student";


    if (headerUserName) {
        headerUserName.textContent = name;
    }


    if (headerUserRole) {
        headerUserRole.textContent =
            formatRole(role);
    }


    if (welcomeTitle) {

        welcomeTitle.textContent =
            `Welcome back, ${getFirstName(name)}! 👋`;

    }


    if (userAvatar) {

        userAvatar.textContent =
            getInitials(name);

        userAvatar.setAttribute(
            "aria-label",
            `${name} profile`
        );

    }

}


/* =========================================================
   FALLBACK USER DISPLAY
   ========================================================= */

function renderFallbackUser() {

    if (!currentUser) return;

    const name =
        currentUser.user_metadata?.full_name ||
        currentUser.email?.split("@")[0] ||
        "Nexus User";


    if (headerUserName) {
        headerUserName.textContent = name;
    }


    if (headerUserRole) {
        headerUserRole.textContent = "Student";
    }


    if (welcomeTitle) {
        welcomeTitle.textContent =
            `Welcome back, ${getFirstName(name)}! 👋`;
    }


    if (userAvatar) {
        userAvatar.textContent = getInitials(name);
    }

}


/* =========================================================
   LOAD DASHBOARD DATA
   ========================================================= */

async function loadDashboardData() {

    if (!currentUser) return;


    /*
       Each query is handled separately.
       This is important because one empty/problematic
       table should not stop the entire dashboard.
    */

    const [
        enrollmentsResult,
        progressResult,
        quizzesResult,
        bookmarksResult,
        notificationsResult
    ] = await Promise.all([

        safeQuery(
            () =>
                supabaseClient
                    .from("enrollments")
                    .select(
                        "id, course_id, status, progress_percent, enrolled_at, completed_at"
                    )
                    .eq("user_id", currentUser.id)
                    .order("enrolled_at", {
                        ascending: false
                    }),
            "enrollments"
        ),

        safeQuery(
            () =>
                supabaseClient
                    .from("lesson_progress")
                    .select(
                        "id, lesson_id, completed, progress_percent, last_position_seconds, updated_at, completed_at"
                    )
                    .eq("user_id", currentUser.id)
                    .order("updated_at", {
                        ascending: false
                    }),
            "lesson progress"
        ),

        safeQuery(
            () =>
                supabaseClient
                    .from("quiz_attempts")
                    .select(
                        "id, quiz_id, attempt_number, score, percentage, passed, created_at, completed_at"
                    )
                    .eq("user_id", currentUser.id)
                    .order("created_at", {
                        ascending: false
                    }),
            "quiz attempts"
        ),

        safeQuery(
            () =>
                supabaseClient
                    .from("bookmarks")
                    .select(
                        "id, lesson_id, created_at"
                    )
                    .eq("user_id", currentUser.id)
                    .order("created_at", {
                        ascending: false
                    }),
            "bookmarks"
        ),

        safeQuery(
            () =>
                supabaseClient
                    .from("notifications")
                    .select(
                        "id, title, message, type, is_read, created_at"
                    )
                    .eq("user_id", currentUser.id)
                    .order("created_at", {
                        ascending: false
                    }),
            "notifications"
        )

    ]);


    dashboardData.enrollments =
        enrollmentsResult.data || [];

    dashboardData.progress =
        progressResult.data || [];

    dashboardData.quizzes =
        quizzesResult.data || [];

    dashboardData.bookmarks =
        bookmarksResult.data || [];

    dashboardData.notifications =
        notificationsResult.data || [];


    /*
       Load course titles separately.
    */

    await loadCourseInformation();


    /*
       Load lesson titles for bookmarks/activity.
    */

    await loadLessonInformation();

}


/* =========================================================
   SAFE SUPABASE QUERY
   ========================================================= */

async function safeQuery(queryFunction, label) {

    try {

        const result = await queryFunction();

        if (result.error) {

            console.warn(
                `Nexus ${label} query:`,
                result.error.message
            );

            return {
                data: [],
                error: result.error
            };

        }

        return result;

    } catch (error) {

        console.warn(
            `Nexus ${label} exception:`,
            error
        );

        return {
            data: [],
            error
        };

    }

}


/* =========================================================
   COURSE INFORMATION
   ========================================================= */

let courseMap = {};


async function loadCourseInformation() {

    const courseIds =
        dashboardData.enrollments
            .map(item => item.course_id)
            .filter(Boolean);


    if (!courseIds.length) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("courses")
            .select(
                "id, title, description"
            )
            .in("id", courseIds);


        if (error) {

            console.warn(
                "Nexus courses query:",
                error.message
            );

            return;
        }


        courseMap = {};

        (data || []).forEach(course => {

            courseMap[course.id] = course;

        });


    } catch (error) {

        console.warn(
            "Course information error:",
            error
        );

    }

}


/* =========================================================
   LESSON INFORMATION
   ========================================================= */

let lessonMap = {};


async function loadLessonInformation() {

    const lessonIds = [

        ...dashboardData.progress
            .map(item => item.lesson_id),

        ...dashboardData.bookmarks
            .map(item => item.lesson_id)

    ].filter(Boolean);


    const uniqueLessonIds =
        [...new Set(lessonIds)];


    if (!uniqueLessonIds.length) {
        return;
    }


    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("lessons")
            .select(
                "id, title, description"
            )
            .in("id", uniqueLessonIds);


        if (error) {

            console.warn(
                "Nexus lessons query:",
                error.message
            );

            return;
        }


        lessonMap = {};

        (data || []).forEach(lesson => {

            lessonMap[lesson.id] = lesson;

        });


    } catch (error) {

        console.warn(
            "Lesson information error:",
            error
        );

    }

}


/* =========================================================
   RENDER DASHBOARD
   ========================================================= */

function renderDashboard() {

    renderStatistics();

    renderProgress();

    renderContinueLearning();

    renderRecentActivity();

    renderBookmarks();

    renderNotifications();

    renderUserInformation();

}


/* =========================================================
   STATISTICS
   ========================================================= */

function renderStatistics() {

    const enrollments =
        dashboardData.enrollments;

    const progress =
        dashboardData.progress;

    const quizzes =
        dashboardData.quizzes;


    const enrolledCount =
        enrollments.length;


    const completedCount =
        enrollments.filter(
            item => item.status === "completed"
        ).length;


    let average = 0;


    if (enrolledCount > 0) {

        const totalProgress =
            enrollments.reduce(
                (sum, item) =>
                    sum +
                    Number(item.progress_percent || 0),
                0
            );

        average =
            Math.round(
                totalProgress / enrolledCount
            );

    }


    if (enrolledCourses) {
        enrolledCourses.textContent =
            enrolledCount;
    }


    if (completedCourses) {
        completedCourses.textContent =
            completedCount;
    }


    if (averageProgress) {
        averageProgress.textContent =
            average;
    }


    if (quizAttempts) {
        quizAttempts.textContent =
            quizzes.length;
    }


    if (progressCourses) {
        progressCourses.textContent =
            enrolledCount;
    }


    if (completedLessons) {

        completedLessons.textContent =
            progress.filter(
                item => item.completed === true
            ).length;

    }


    if (progressQuizzes) {
        progressQuizzes.textContent =
            quizzes.length;
    }

}


/* =========================================================
   PROGRESS CIRCLE
   ========================================================= */

function renderProgress() {

    const enrollments =
        dashboardData.enrollments;


    let average = 0;


    if (enrollments.length) {

        const total =
            enrollments.reduce(
                (sum, item) =>
                    sum +
                    Number(item.progress_percent || 0),
                0
            );

        average =
            Math.round(
                total / enrollments.length
            );

    }


    if (overallProgress) {

        overallProgress.textContent =
            `${average}%`;

    }


    const circle =
        document.querySelector(".progress-circle");


    if (circle) {

        const degrees =
            Math.max(
                0,
                Math.min(
                    360,
                    average * 3.6
                )
            );


        circle.style.background =
            `conic-gradient(
                #8b5cf6 0deg,
                #22d3ee ${degrees}deg,
                rgba(255,255,255,0.07) ${degrees}deg
            )`;

    }

}


/* =========================================================
   CONTINUE LEARNING
   ========================================================= */

function renderContinueLearning() {

    if (!continueLearning) return;


    if (!dashboardData.enrollments.length) {

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


        const button =
            document.getElementById(
                "emptyExploreBtn"
            );


        if (button) {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    showComingSoon(
                        "Course Explorer"
                    );

                }
            );

        }

        return;

    }


    const courses =
        dashboardData.enrollments
            .slice(0, 3);


    continueLearning.innerHTML =
        courses.map(enrollment => {

            const course =
                courseMap[enrollment.course_id];


            const title =
                course?.title ||
                "Learning Course";


            const progress =
                Math.round(
                    Number(
                        enrollment.progress_percent || 0
                    )
                );


            return `
                <div class="nexus-course-row">

                    <div class="nexus-course-icon">
                        📚
                    </div>

                    <div class="nexus-course-info">

                        <strong>
                            ${escapeHTML(title)}
                        </strong>

                        <div class="nexus-course-progress">

                            <div
                                class="nexus-course-progress-bar">

                                <span
                                    style="width:${progress}%">
                                </span>

                            </div>

                           