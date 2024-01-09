import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Category from '../Category'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    status: apiStatusConstants.initial,
    restaurantName: '',
    listMenu: [],
    value: '',
    count: 0,
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    this.setState({status: apiStatusConstants.inProgress})
    const dishesApiUrl =
      'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'
    const response = await fetch(dishesApiUrl)
    const data = await response.json()
    const restaurantName = data[0].restaurant_name
    const dishQuantityAdd = data[0].table_menu_list.map(each => ({
      category_dishes: each.category_dishes.map(cate => ({
        ...cate,
        dish_quantity: '0',
      })),
      menu_category: each.menu_category,
      menu_categoryId: each.menu_category_id,
    }))
    this.setState({
      listMenu: dishQuantityAdd,
      restaurantName,
      value: dishQuantityAdd[0].menu_category,
      status: apiStatusConstants.success,
    })
  }

  onChooseList = value => {
    this.setState({value})
  }

  onIncreaseDecreaseCount = (dishId, operator) => {
    const {listMenu} = this.state
    const finalValue = listMenu.map(each => ({
      ...each,
      category_dishes: each.category_dishes.map(eachDish => {
        if (eachDish.dish_id === dishId) {
          if (operator === 'decrement' && eachDish.dish_quantity > 0) {
            this.setState(prevs => ({
              count: prevs.count - 1,
            }))
            return {
              ...eachDish,
              dish_quantity: parseInt(eachDish.dish_quantity) - 1,
            }
          }
          if (operator === 'increment') {
            this.setState(prevs => ({
              count: prevs.count + 1,
            }))
            return {
              ...eachDish,
              dish_quantity: parseInt(eachDish.dish_quantity) + 1,
            }
          }
        }
        return eachDish
      }),
    }))
    this.setState({listMenu: finalValue})
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Rings" color="#00BFFF" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {listMenu, value} = this.state
    const filteredDishes = listMenu.filter(each => each.menu_category === value)
    return (
      <>
        <ul className="menu_container">
          {listMenu.map(each => (
            <li key={each.menu_categoryId}>
              <button
                type="button"
                className={
                  each.menu_category === value
                    ? 'chosen-button'
                    : 'category-button'
                }
                onClick={() => this.onChooseList(each.menu_category)}
              >
                {each.menu_category}
              </button>
            </li>
          ))}
        </ul>
        {filteredDishes.map(each => (
          <Category
            nextComponent={each.category_dishes}
            key={each.menu_categoryId}
            onDecreaseIncrease={this.onIncreaseDecreaseCount}
          />
        ))}
      </>
    )
  }

  render() {
    const {restaurantName, status} = this.state

    return (
      <>
        <Header restaurantName={restaurantName} />
        {status === apiStatusConstants.inProgress
          ? this.renderLoader()
          : this.renderSuccessView()}
      </>
    )
  }
}

export default Home
