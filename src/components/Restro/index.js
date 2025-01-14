import {Component} from 'react'
import './index.css'

class Restro extends Component {
  state = {
    categories: [],
    activeCategory: null,
    activeDishes: [],
    cartCount: 0,
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
      console.log('api response', fetchedData)
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

  incrementDishQuantity = dishId => {
    this.setState(prevState => {
      const updatedDishQuantities = {
        ...prevState.dishQuantities,
        [dishId]: (prevState.dishQuantities[dishId] || 0) + 1,
      }
      return {
        dishQuantities: updatedDishQuantities,
        cartCount: prevState.cartCount + 1,
      }
    })
  }

  decrementDishQuantity = dishId => {
    this.setState(prevState => {
      if (prevState.dishQuantities[dishId] > 0) {
        const updatedDishQuantities = {
          ...prevState.dishQuantities,
          [dishId]: prevState.dishQuantities[dishId] - 1,
        }
        return {
          dishQuantities: updatedDishQuantities,
          cartCount: prevState.cartCount - 1,
        }
      }
      return null
    })
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

    return (
      <div className="restro-container">
        <header className="header">
          <h1>{restaurantName}</h1>
          <p>My Orders</p>
          <p>{cartCount}</p>
        </header>
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
                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => this.decrementDishQuantity(dish.dish_id)}
                    >
                      -
                    </button>
                    <span>{dishQuantities[dish.dish_id] || 0}</span>
                    <button
                      type="button"
                      onClick={() => this.incrementDishQuantity(dish.dish_id)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default Restro
