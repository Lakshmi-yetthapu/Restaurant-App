import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaShoppingCart} from 'react-icons/fa'

import './index.css'

class Home extends Component {
  state = {
    categories: [],
    activeCategory: null,
    activeDishes: [],
    cartCount: 0,
    cartList: [],
    dishQuantities: {},
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    const apiUrl =
      'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const restaurantName = fetchedData[0].restaurant_name
      const categories = fetchedData[0].table_menu_list.map(category => ({
        name: category.menu_category,
        id: category.menu_category_id,
        dishes: category.category_dishes,
      }))

      this.setState({
        categories,
        restaurantName,
        activeCategory: categories[0].id,
        activeDishes: categories[0].dishes,
      })
    }
  }

  setActiveCategory = categoryId => {
    const {categories} = this.state
    const activeCategory = categories.find(
      category => category.id === categoryId,
    )

    this.setState({
      activeCategory: categoryId,
      activeDishes: activeCategory.dishes,
    })
  }

  handleIncrementDishQuantity = dishId => {
    this.setState(prevState => {
      const updatedDishQuantities = {
        ...prevState.dishQuantities,
        [dishId]: (prevState.dishQuantities[dishId] || 0) + 1,
      }
      return {
        dishQuantities: updatedDishQuantities,
      }
    })
  }

  handleDecrementDishQuantity = dishId => {
    this.setState(prevState => {
      const currentQuantity = prevState.dishQuantities[dishId] || 0
      if (currentQuantity > 0) {
        const updatedDishQuantities = {
          ...prevState.dishQuantities,
          [dishId]: currentQuantity - 1,
        }
        return {
          dishQuantities: updatedDishQuantities,
        }
      }
      return null
    })
  }

  handleAddToCart = dish => {
    const {dishQuantities, cartList} = this.state
    const quantity = dishQuantities[dish.dish_id] || 1
    const existingItemIndex = cartList.findIndex(
      item => item.dish_id === dish.dish_id,
    )

    if (existingItemIndex >= 0) {
      const updatedCartList = [...cartList]
      updatedCartList[existingItemIndex].quantity += quantity
      this.setState({cartList: updatedCartList})
      localStorage.setItem('cartList', JSON.stringify(updatedCartList))
    } else {
      const newItem = {...dish, quantity}
      this.setState(prevState => {
        const updatedCartList = [...prevState.cartList, newItem]
        localStorage.setItem('cartList', JSON.stringify(updatedCartList))
        return {cartList: updatedCartList}
      })
    }
    const updatedCartCount =
      cartList.reduce((acc, item) => acc + item.quantity, 0) + quantity
    this.setState({cartCount: updatedCartCount})
  }

  handleLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  render() {
    const {
      categories,
      activeCategory,
      activeDishes,
      cartCount,
      dishQuantities,
      restaurantName,
    } = this.state
    const {history} = this.props

    return (
      <div className="restro-container">
        <div className="header-bar">
          <h1 onClick={() => history.push('/')} className="restaurant-name">
            {restaurantName}
          </h1>
          <p>My Orders</p>
          <Link to="/cart" className="cart-icon">
            <p>0</p>
            <button data-testid="cart" type="button">
              <FaShoppingCart /> {cartCount}
            </button>
          </Link>
          <button
            type="button"
            onClick={this.handleLogout}
            className="logout-button"
          >
            Logout
          </button>
        </div>
        <div className="menu">
          <ul className="categories">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  type="button"
                  className={
                    activeCategory === category.id ? 'active-category' : ''
                  }
                  onClick={() => this.setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="dishes">
            {activeDishes.map(dish => (
              <div key={dish.dish_id} className="dish-card">
                <img
                  src={dish.dish_image}
                  alt={dish.dish_name}
                  className="dish-image"
                />
                <h1>{dish.dish_name}</h1>
                <p>
                  {dish.dish_currency} {dish.dish_price}
                </p>
                <p>{dish.dish_description}</p>
                <p>{dish.dish_calories} calories</p>
                <p>{dish.dish_Availability ? 'Available' : 'Not Available'}</p>
                {dish.dish_Availability && (
                  <>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() =>
                          this.handleDecrementDishQuantity(dish.dish_id)
                        }
                      >
                        -
                      </button>
                      <span>{dishQuantities[dish.dish_id] || 0}</span>
                      <button
                        type="button"
                        onClick={() =>
                          this.handleIncrementDishQuantity(dish.dish_id)
                        }
                      >
                        +
                      </button>
                    </div>
                    {dishQuantities[dish.dish_id] > 0 && (
                      <button
                        type="button"
                        className="add-to-cart-button"
                        onClick={() => this.handleAddToCart(dish)}
                      >
                        ADD TO CART
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Home
