window.addEventListener('load', () => {
    const form = document.querySelector("#new-task-form");
    const input = document.querySelector("#new-task-input");
    const dateInput = document.querySelector("#task-date");
    const priorityInput = document.querySelector("#task-priority");
    const list_el = document.querySelector("#tasks");
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const speakTask = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        speechSynthesis.speak(speech);
    };

    const displayTasks = () => {
        list_el.innerHTML = ""; 

        tasks.forEach((task, index) => {
            const task_el = document.createElement("div");
            task_el.classList.add("task");
            task_el.setAttribute("data-priority", task.priority);

            const task_content_el = document.createElement("div");
            task_content_el.classList.add("content");

            const task_input_el = document.createElement("input");
            task_input_el.classList.add("text");
            task_input_el.type = "text";
            task_input_el.value = `${task.text} (Due: ${task.date})`;
            task_input_el.setAttribute("readonly", "readonly");

            task_content_el.appendChild(task_input_el);

            const task_actions_el = document.createElement("div");
            task_actions_el.classList.add("actions");

            const task_edit_el = document.createElement("button");
            task_edit_el.classList.add("edit");
            task_edit_el.innerText = "Edit";

            const task_delete_el = document.createElement("button");
            task_delete_el.classList.add("delete");
            task_delete_el.innerText = "Delete";

            const task_speak_el = document.createElement("button");
            task_speak_el.classList.add("speak");
            task_speak_el.innerText = "🔊 Speak";

            const task_done_el = document.createElement("button");
            task_done_el.classList.add("done");
            task_done_el.innerText = "✅ Done";

            task_actions_el.appendChild(task_edit_el);
            task_actions_el.appendChild(task_speak_el);
            task_actions_el.appendChild(task_done_el);
            task_actions_el.appendChild(task_delete_el);

            task_el.appendChild(task_content_el);
            task_el.appendChild(task_actions_el);

            list_el.appendChild(task_el);

            task_edit_el.addEventListener("click", () => {
                if (task_edit_el.innerText.toLowerCase() === "edit") {
                    task_edit_el.innerText = "Save";
                    task_input_el.removeAttribute("readonly");
                    task_input_el.focus();
                } else {
                    task_edit_el.innerText = "Edit";
                    task_input_el.setAttribute("readonly", "readonly");
                    tasks[index].text = task_input_el.value.split("(Due:")[0].trim();
                    saveTasks();
                }
            });

            task_delete_el.addEventListener("click", () => {
                task_el.style.animation = "fadeOut 0.5s ease-in-out forwards";
                setTimeout(() => {
                    tasks.splice(index, 1);
                    saveTasks();
                    displayTasks();
                }, 500);
            });

            task_speak_el.addEventListener("click", () => {
                speakTask(task.text);
            });

            task_done_el.addEventListener("click", () => {
                task_el.style.backgroundColor = "green";
                task_el.style.color = "white";
                task_input_el.style.textDecoration = "line-through";
                saveTasks();
            });
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const task = {
            text: input.value.trim(),
            date: dateInput.value,
            priority: priorityInput.value
        };

        if (!task.text) return;

        tasks.push(task);
        saveTasks();
        input.value = "";
        dateInput.value = "";
        displayTasks();
    });

    displayTasks();
});
