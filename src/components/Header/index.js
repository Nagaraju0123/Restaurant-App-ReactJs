import {Link, withRouter} from 'react-router-dom'
import {AiOutlineShoppingCart} from 'react-icons/ai'
import Cookies from 'js-cookie'
import CartContext from '../CartContext'

import './index.css'

const Header = props => (
  <CartContext.Consumer>
    {context => {
      const {cartList} = context
      const onLogout = () => {
        Cookies.remove('jwt_token')
        const {history} = props
        history.replace('/login')
      }

      const {restaurantName} = props
      const {match} = props
      const {path} = match
      // const chosenHome = path === '/' ? 'chosenLink' : null
      const chosenCart = path === '/cart' ? 'chosenLink' : null
      return (
        <div className="bg-container">
          <Link to="/" className="link">
            <h1 className="heading">{restaurantName}</h1>
          </Link>
          <div className="card_container">
            <p className="my_order">My Orders</p>
            <Link
              to={{pathname: '/cart', state: restaurantName}}
              className="link"
            >
              <button type="button" className="cartButton">
                <AiOutlineShoppingCart className={`icon_cart ${chosenCart}`} />
              </button>
            </Link>
            <p className="background">{cartList.length}</p>
            <button type="button" className="buttonLogout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      )
    }}
  </CartContext.Consumer>
)

export default withRouter(Header)
