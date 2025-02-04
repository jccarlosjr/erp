function toggleNav() {
    const sidebar = document.getElementById("mySidebar");
    const isExpanded = sidebar.classList.contains("expanded");

    document.querySelectorAll('.dropdown-container').forEach(dropdown => dropdown.classList.remove('show'));

    sidebar.classList.toggle("expanded", !isExpanded);
}

document.addEventListener('click', function (event) {
    const sidebar = document.getElementById("mySidebar");
    const toggleBtn = document.getElementById("toggleBtn");

    if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target) && sidebar.classList.contains('expanded')) {
        toggleNav();
    }
});

document.querySelectorAll('.menu-item').forEach(menuItem => {
    menuItem.addEventListener('click', function (event) {
        event.preventDefault();
        const targetId = this.getAttribute('data-target');
        const dropdown = document.getElementById(targetId);
        const sidebar = document.getElementById("mySidebar");

        if (!sidebar.classList.contains("expanded")) {
            sidebar.classList.add("expanded");
        }

        if (dropdown) {
            const isDropdownVisible = dropdown.classList.contains('show');

            document.querySelectorAll('.dropdown-container').forEach(d => d.classList.remove('show')); // Oculta outros dropdowns

            if (!isDropdownVisible) {
                dropdown.classList.add('show');
            }
        }
    });
});
