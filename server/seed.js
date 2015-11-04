import constants from '../src/constants';
import Order from '../models/order';
import Item from '../models/item';

// seeding for dev
function seedData() {
  Order.remove({}, () => {
    console.log('Orders collection dropped');
  });

  Item.remove({}, () => {
    console.log('Items collection dropped');
  });

  Item({
    name: 'Pho',
    price: 1050
  }).save((err, item) => {
    Order({
      id: '18',
      status: constants.CLOSED,
      items: item._id
    }).save();
  });

  Item({
    name: 'Bun Bo Hue',
    price: 1125
  }).save((err, item) => {
    Order({
      id: '15',
      status: constants.CLOSED,
      items: item._id
    }).save();

    Order({
      id: '16',
      status: constants.OPEN,
      items: item._id
    }).save();

    Order({
      id: '17',
      status: constants.READY_FOR_BILL,
      items: item._id
    }).save();
  });
}

export default seedData;
