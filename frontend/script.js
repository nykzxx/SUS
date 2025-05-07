document.body.onload = () => {
    document.getElementById("container").className = 'bg-slate-400 p-3 rounded-lg hidden'
}

async function getUser() {
    const hash = document.getElementById('hash').value;
    if (hash) {
        try {
            const response = await fetch(`http://localhost:3030/api/users/${Number(hash)}`);
            if (!response.ok) throw new Error("User not found");
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching user:", error);
            alert("Erro ao buscar o usuário.");
        }
    } else {
        alert("Preencha o campo!");
    }
}

async function showUI() {
    const body = await getUser();
    if (body) {
        document.getElementById("container").className = 'bg-slate-400 p-3 rounded-lg'
        document.getElementById("hash").innerText = body.hash;
        document.getElementById("name").innerText = body.name;
        document.getElementById("cpf").innerText = body.cpf;
        document.getElementById("gender").innerText = body.gender;
        document.getElementById("height").innerText = body.height;
        document.getElementById("weight").innerText = body.weight;
        document.getElementById("birth").innerText = body.birth;
        document.getElementById("age").innerText = body.age;
    }
}
