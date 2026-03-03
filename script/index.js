// ================
const createElements = (arr) => {
    console.log(arr);
    const htmlElements = arr.map((el) =>
        ` <span class="btn"> ${el}</span>`)
    return (htmlElements.join(" "));
}
// ==================
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const manageSpinner = (status) => {

    if (status == true) {
        document.getElementById('spinner').classList.remove("hidden");
        document.getElementById('word-container').classList.add("hidden");
    } else {
        document.getElementById('spinner').classList.add("hidden");
        document.getElementById('word-container').classList.remove("hidden");

    }

}
// 1
const loadLessons = () => {

    const url = "https://openapi.programming-hero.com/api/levels/all"

    fetch(url)
        .then(res => res.json())
        .then(json => displayLesson(json.data));
}

// 2
const displayLesson = (lessons) => {

    console.log(lessons);

    const levelContainer = document.getElementById('level-container')

    levelContainer.innerHTML = "";

    for (let lesson of lessons) {

        const btnDiv = document.createElement('div');

        btnDiv.innerHTML = `
    
    <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})"
    class="btn btn-outline btn-primary cursor-pointer lesson-btn">
    <i class="fa-solid fa-book-open"></i>
        Lesson -${lesson.level_no}
    </button>
    `;
        levelContainer.append(btnDiv)
    }
}


const removeActive = () => {

    const lessonButton = document.querySelectorAll(".lesson-btn")
    console.log(lessonButton);
    lessonButton.forEach((btn) => btn.classList.remove('active'))

}
// 3
const loadLevelWord = (id) => {
    manageSpinner(true);
    // console.log(id);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;

    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive() //remove all active

            const clickBtn = document.getElementById(`lesson-btn-${id}`);

            // console.log(clickBtn);
            clickBtn.classList.add('active'); //add active class

            displayLevelWord(data.data)
        })
}
// 5
const loadWordDetail = async (id) => {

    const url = `https://openapi.programming-hero.com/api/word/${id}`;

    // fetch(url)
    //     .then(res => res.json())
    //     .then(data => console.log(data.data))

    // console.log(url);

    const res = await fetch(url);

    const details = await res.json();

    displayWordDetails(details.data);

}
// 6
const displayWordDetails = (word) => {

    console.log(word);
    const detailsBox = document.getElementById('details-container')

    detailsBox.innerHTML = `
<div class="space-y-5">

                        <!-- Title -->
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">
                            ${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation} )
                        </h2>

                        <!-- Meaning -->
                        <div class="mb-4">
                            <h4 class="font-semibold text-gray-700">Meaning</h4>
                            <p class="text-gray-600 mt-1">${word.meaning}</p>
                        </div>

                        <!-- Example -->
                        <div class="mb-4">
                            <h4 class="font-semibold text-gray-700">Example</h4>
                            <p class="text-gray-600 mt-1">
                                ${word.sentence}
                            </p>
                        </div>

                        <!-- Similar Words -->
                        <div class="mb-6">
                            <h4 class="font-semibold text-gray-700 mb-2">synonyms</h4>
                            <div class="flex gap-2">
                               <div>${createElements(word.synonyms)}</div>
                            </div>
                        </div>

                        <!-- Button -->
                        <button
                            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition">
                            Complete Learning
                        </button>

                    </div>     
`;
    document.getElementById('word_modal').showModal();

}
// 4
const displayLevelWord = (words) => {

    const wordContainer = document.getElementById('word-container')
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="text-center col-span-full  space-y-5 ">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                
                <h6 class="text-balance font-bangla text-[#79716B]">
                        এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
                </h6>
                <h2 class="text-4xl font-bangla text-[#292524]">নেক্সট Lesson এ যান</h2>
        </div>
        
        `;
        manageSpinner(false)
        return;
    }

    words.forEach(word => {
        const card = document.createElement('div');
        card.innerHTML = `
        
       <div class="bg-white  rounded-2xl 
       shadow-md p-6 text-center ">

                    <!-- Title -->
                    <h2 class="text-2xl font-semibold mb-2">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>

                    <!-- Subtitle -->
                    <p class="text-gray-600 text-sm mb-4">Meaning / Pronunciation</p>

                    <!-- Bangla Meaning -->
                    <p class="text-lg font-medium mb-8 font-bangla">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "pronunciation পাওয়া যায়নি"}"</p>

                    <!-- Bottom Icons -->
                    <div class="flex justify-between items-center">
                     <!-- function call  -->
                   
                        <button onclick="loadWordDetail(${word.id})" class="bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>

                        <button onclick="pronounceWord('${word.word}')" class="bg-gray-300 p-2 rounded-lg hover:bg-gray-400 transition">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                </div>
        
        `;

        wordContainer.append(card)


    });

    manageSpinner(false);
}

loadLessons();
// =====================Search======
document.getElementById("btn-search")
    .addEventListener("click", () => {
        removeActive();
        const inputSearch = document.getElementById("input-search");

        const searchValue = inputSearch.value.trim().toLowerCase();

        // console.log(searchValue);

        fetch("https://openapi.programming-hero.com/api/words/all")
            .then(res => res.json())
            .then(data => {

                const allWords = data.data;
                // console.log(allWords);

                const filterWords = allWords.
                    filter((word) => word.word.toLowerCase().includes(searchValue));
                // console.log(filterWords);

                displayLevelWord(filterWords)

            })

    })
