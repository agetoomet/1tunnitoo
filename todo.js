console.log("Fail ühendatud")

class Entry{
    constructor(title, description, date, priority){
        this.title = title;
        this.description = description;
        this.date = date;
        this.done = false;
        this.priority = priority;
    }
}

class Todo{
    constructor(){
        this.entries = JSON.parse(localStorage.getItem('entries')) || [];
        this.render();
        document.querySelector('#addButton').addEventListener('click', ()=> {this.addEntry()});
    }

    addEntry(){
        console.log('vajutasin nuppu');
        const titleValue = document.querySelector('#title').value;
        const descriptionValue = document.querySelector('#description').value;
        const dateValue = document.querySelector('#date').value;
        const priorityValue = document.querySelector('#priority').value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));
        console.log(this.entries);
        this.save();
    } 

    render(){
        let tasklist = document.querySelector('#tasklist');
        tasklist.innerHTML = "";
        
        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";

        this.entries.sort((a, b) => new Date(a.date) - new Date(b.date));  
            //laenatud ChatGBT, prompt: how to sort entries by date in js

        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");
            doneButton.innerText = "✔"
            deleteButton.innerText = "X";
            editButton.innerText = "Edit";
            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";
            const formattedDate = formatDate(entryValue.date);

            editButton.addEventListener("click", ()=> {
                const newValue = this.entries[entryIndex];

                div.innerHTML = "";
                
                const titleInput = document.createElement("input");
                titleInput.type = "text";
                titleInput.value = newValue.title;
                const descInput = document.createElement("input");
                descInput.type = "text";
                descInput.value = newValue.description;
                const dateInput = document.createElement("input");
                dateInput.type = "date";
                dateInput.value = newValue.date;

                const prioritySelect = document.createElement("select");
                prioritySelect.id = "editPriority";

                const priorities = ["kõrge", "keskmine", "madal"];
                priorities.forEach(priority => {
                    const option = document.createElement("option");
                    option.value = priority;
                    option.text = priority;
                    if (priority === newValue.priority) {
                        option.selected = true;
                    }
                    prioritySelect.appendChild(option);
                });     
                    //tsükkel laenatud claude, prompt: how to present the selected priority value in tasklist

                const saveButton = document.createElement("button");
                saveButton.innerText = "Save";
                saveButton.className = "save";

                saveButton.addEventListener("click", ()=>{
                    newValue.title = titleInput.value;
                    newValue.description = descInput.value;
                    newValue.date = dateInput.value;
                    newValue.priority = prioritySelect.value;

                    this.save();
                })
                
                div.appendChild(titleInput);
                div.appendChild(descInput);
                div.appendChild(dateInput);
                div.appendChild(prioritySelect);
                div.appendChild(saveButton);
            });

            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();
                
            });

            doneButton.addEventListener("click", () => {
                if(this.entries[entryIndex].done){
                    this.entries[entryIndex].done = false;
                } else{
                    this.entries[entryIndex].done = true;
                }
                
                this.save();
            });



            div.className = "task";

            const priorityClass = getPriorityClass(entryValue.priority);    
                    //laenatud claude, prompt: how to present the selected priority value in tasklist
            div.classList.add(priorityClass);   
                    //laenatud claude, prompt: how to present the selected priority value in tasklist

            div.innerHTML = `
                <div>tekst ${entryValue.title}</div>
                <div>${entryValue.description}</div>
                <div>${formattedDate}</div>
                <div class="priority-tag ${priorityClass}">Prioriteet: ${entryValue.priority || ""} </div>
            `;      
                //viimane div laenatud claude, prompt: how to present the selected priority value in tasklist
            
            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }


            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
            
        });

        tasklist.appendChild(taskHeading)
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
    }

    save() {
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
}

function getPriorityClass(priority) {
    if (!priority) return "low-priority"; 

    switch(priority) {
        case "kõrge": return "high-priority";
        case "keskmine": return "medium-priority";
        case "madal": return "low-priority";
        default: return "";
    }
}
    //laenatud claude, prompt: how to present the selected priority value in tasklist


const todo = new Todo();

function formatDate(dateString){        
        // sulgudesse lisatud dateString: claude, prompt: how to change date format
    const date = new Date(dateString);  
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if(day < 10){
        day = "0" + day;
    }

    if(month < 10){
        month = "0" + month;
    }

    return `${day}.${month}.${year}`;   //claude, prompt: how to change date format
}