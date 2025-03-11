document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");
    
    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("show");
    });

    function filterCourses(category) {
        const courses = document.querySelectorAll(".course");
        courses.forEach(course => {
            if (category === "all" || course.classList.contains(category)) {
                course.style.display = "block";
            } else {
                course.style.display = "none";
            }
        });
    }

    window.filterCourses = filterCourses;


    function updateLastUpdate() {
        const lastUpdateElement = document.querySelector("footer p:nth-child(2)");
        const now = new Date();
        const formattedDate = now.toLocaleString("en-US", {
            year: "numeric", month: "2-digit", day: "2-digit",
            hour: "2-digit", minute: "2-digit", second: "2-digit"
        });
        lastUpdateElement.textContent = `Last Update: ${formattedDate}`;
    }

    updateLastUpdate();
});