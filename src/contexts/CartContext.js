import React, {createContext, useState} from 'react'

const CartContext = createContext()

const CartProvider = ({children}) => {
  const [cartList, setCartList] = useState([])

  const addCartItem = dish => {
    setCartList(prevCartList => {
      const existingDishIndex = prevCartList.findIndex(
        item => item.dish_id === dish.dish_id,
      )

      if (existingDishIndex !== -1) {
        const updatedCartList = [...prevCartList]
        updatedCartList[existingDishIndex].quantity += 1
        return updatedCartList
      }
      return [...prevCartList, {...dish, quantity: 1}]
    })
  }

  const removeCartItem = dishId => {
    setCartList(prevCartList =>
      prevCartList.filter(item => item.dish_id !== dishId),
    )
  }

  const incrementCartItemQuantity = dishId => {
    setCartList(prevCartList =>
      prevCartList.map(item =>
        item.dish_id === dishId ? {...item, quantity: item.quantity + 1} : item,
      ),
    )
  }

  const decrementCartItemQuantity = dishId => {
    setCartList(prevCartList =>
      prevCartList.map(item =>
        item.dish_id === dishId && item.quantity > 1
          ? {...item, quantity: item.quantity - 1}
          : item,
      ),
    )
  }

  const removeAllCartItems = () => {
    setCartList([])
  }

  return (
    <CartContext.Provider
      value={{
        cartList,
        addCartItem,
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export {CartContext, CartProvider}
