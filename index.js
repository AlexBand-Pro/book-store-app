import menuData from "./data.js"

let userOrderlist = []
let name = ""
let cardNumber = ""
let cvv = ""

const main = document.querySelector("main")
document.addEventListener("click", (e) => {
    if (e.target.dataset.name) {
        addTargetPosition(e.target.dataset.name)
        renderMain()
    } else if (e.target.dataset.order) {
        deleteTargetPosition(e.target.dataset.order)
    } else if (e.target.id === "place-order-btn") {
        document.querySelector(".payment-modal").style.display = "block"
        userOrderlist = []
    }
})

const form = document.getElementById("form");
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(form)
        
        name = formData.get("name")
        cardNumber = formData.get("card-number")
        cvv = formData.get("cvv")
        
        const paymentModal = document.querySelector(".payment-modal")
        paymentModal.style.display = "none"
        paymentModal.innerHTML = ""
        const main = document.querySelector("main")
        const sect = document.getElementById("order-section")
        main.removeChild(sect)
        thankUser()
    });
}


const addTargetPosition = (targetName) => {
    const targetPosition = menuData.filter(position => position.name === targetName)[0]
    userOrderlist.push({
        bookName: targetPosition.name,
        bookPrice: targetPosition.price,
        discount: targetPosition.discount
    })
    
    return targetPosition
}

const deleteTargetPosition = (targetName) => {
    const index = userOrderlist.findIndex(position => targetName === position.bookName);

    if (index !== -1) {
        userOrderlist.splice(index, 1);
        renderMain()
    }
}

const thankUser = () => {
    main.innerHTML = ""
    const message = `<section id="thanks-section">
                        <div class="order-placed-msg">
                            <p>Thanks, ${name}! Your order is on the way!</p>
                        </div>
                    </section>`
    const rateUsHtml = `<section id="last-section">
                            <div class="rating-message">
                                <p class="rate-us-line">How was your experience?</p>
                                <div class="rating-stars">
                                    <i class="fa-regular fa-star" id="star-0"></i>
                                    <i class="fa-regular fa-star" id="star-1"></i>
                                    <i class="fa-regular fa-star" id="star-2"></i>
                                    <i class="fa-regular fa-star" id="star-3"></i>
                                    <i class="fa-regular fa-star" id="star-4"></i>
                                </div>
                            </div>
                        </section>`
    main.innerHTML += message + rateUsHtml
    rateExperience()
}

const rateExperience = () => {
    setTimeout(() => {
        const stars = document.querySelectorAll("i");
        const colorStars = (event) => {
        const index = [...stars].indexOf(event.target);
            for (let i = 0; i < 5; i++) {
                const starIcon = document.getElementById(`star-${i}`)
                starIcon.classList.remove("fa-solid")
            }
            
            for (let i = 0; i <= index; i++) {
                const starIcon = document.getElementById(`star-${i}`)
                starIcon.classList.add("fa-solid")
            }
        }
            
        const removeStarEventListeners = () => {
            document.querySelector(".rate-us-line").style.display = "none"
            const ratingMessageContainer = document.querySelector(".rating-message")
            const thanksForFeedbackLine = document.createElement("p")
            thanksForFeedbackLine.className= "rate-us-line"
            thanksForFeedbackLine.textContent = "Thank you for the feedback!"
            ratingMessageContainer.appendChild(thanksForFeedbackLine)
            
            for (let i = 0; i < 5; i++) {
                const starIcon = document.getElementById(`star-${i}`)
                starIcon.removeEventListener("mouseover", colorStars)
                starIcon.removeEventListener("click", removeStarEventListeners)
                document.querySelector(".rating-stars").style.cursor = "default"
            }
        }
        stars.forEach((star, index) => {
            star.addEventListener("mouseover", colorStars)
            star.addEventListener("click", removeStarEventListeners)
        })
    }, 300)
}

const getMenuHtml = (data) => {
    let html = ""
    data.forEach((book) => {
        const {name, author, id, price, img, description} = book
        html += `<section>
                    <div class="book-item-container">
                        <img src="${img}" alt="BOOK">
                        <div class="book-item-info">
                            <h3 class="book-item-name">${name}</h3>
                            <p class="book-item-author">${author}</p>
                            <span class="book-item-price pushed-left">$ ${price}</span>
                        </div>
                        <button class="add-item-btn" aria-label="Add ${name} to cart" data-name="${name}">+</button>
                    </div>
                    <hr>
                </section>
                `
    })
    
    return html
}

const getOrderedBooks = (orderedBooks) => {
    return orderedBooks.map((book) => {
        const { bookName, bookPrice } = book
        return `<div class="order-book-item-container">
                    <p class="order-book-item">${bookName}</p>
                    <button class="remove-btn" data-order="${bookName}">remove</button>
                    <span class="book-item-price">$${bookPrice}</span>
                </div>`
    }).join("")
}

const getOrder = (userOrderlist) => {
    let totalBill = userOrderlist.reduce((total, currentElement) => {
        return total + currentElement.bookPrice;
    }, 0)
    
    const books = userOrderlist.filter((book) => book.discount)
    if (books.length === 2) {
        totalBill -= 18
    }
    let discountLine = books.length === 2 ?  `<div class="order-book-item-container">
                            <p class="order-book-item">Discount:</p>
                            <span class="book-item-price">$${18}</span>
                        </div>` : ""
    return `<section id="order-section">
                <div class="order-container">
                    <h3 class="order-header">Your Order</h3>
                    ${getOrderedBooks(userOrderlist)}
                    ${discountLine}
                    <hr class="order-divider">
                    <div class="order-total-container">
                        <p class="total-price-line">Total Price:</p>
                        <span class="total-price">$${totalBill}</span>
                    </div>
                    <button class="complete-order-btn" id="place-order-btn">Complete order</button>
                </div>
            </section>
            `
}

const createOfferHtml = () => {
    return `<section class="offer-section">
                <div class="offer-container">
                    <h2 class="offer-header">Limited Time <span class="green-color">Offer!</span></h1>
                    <h3 class="offer-text">Get <span class="green-color">any</span> 2 books by the <span class="green-color">same author</span> and get a <span class="red-color block underline bold">20% discount!</span></h3>
                </div>
            </section>`
}

const renderMain = () => {
    main.innerHTML = createOfferHtml() + getMenuHtml(menuData);
    if (userOrderlist.length > 0) {
        main.innerHTML += getOrder(userOrderlist)
    }
}

renderMain()