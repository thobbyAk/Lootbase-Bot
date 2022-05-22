import { NewDeposit, NewBurn, NewMint } from '../types/templates/Group/Group'
import { Deposit, User, Group, UserGroup } from '../types/schema'
import { BigInt, dataSource, BigDecimal } from '@graphprotocol/graph-ts'
import { safeDiv } from '../utils'

export function handleNewDeposit(event: NewDeposit): void {
  let user = User.load(event.transaction.from.toHex());

  if (user == null) {
    user = new User(event.transaction.from.toHex());
    user.address = event.params.user;
  }

  let deposit = new Deposit(event.transaction.hash.toHex() + "-" + event.logIndex.toString());
  deposit.user = user.id;
  deposit.quantity = event.params.quantity.toBigDecimal();
  deposit.token = event.params.token;
  deposit.time =  event.block.timestamp;
  deposit.save();

  let context = dataSource.context();
  let groupAddress = context.getString('groupAddress');
  let group = Group.load(groupAddress);

  if(group != null) {
    
    group.totalDeposited = group.totalDeposited.plus(deposit.quantity);
    group.totalMinted = group.totalMinted.plus(deposit.quantity);

    let userGroup = UserGroup.load(user.id + "-" + group.id);

    if(userGroup == null) {

      userGroup = new UserGroup(user.id + "-" + group.id);
      userGroup.group = group.id;
      userGroup.user = user.id;
      userGroup.totalDeposited =  BigDecimal.zero();
      userGroup.totalMinted = BigDecimal.zero();
      userGroup.deposits = new Array<string>(0);
    }  
    
    userGroup.totalDeposited =  userGroup.totalDeposited.plus(event.params.quantity.toBigDecimal());
    userGroup.totalMinted = userGroup.totalMinted.plus(event.params.quantity.toBigDecimal());

    let deposits = userGroup.deposits;
    deposits.push(deposit.id);
    userGroup.deposits = deposits;

    user.save();

    group.save()
    userGroup.save();
  }
}

export function handleNewBurn(event: NewBurn): void {
  let user = User.load(event.params.user.toHex());
  if(!user) return;

  let context = dataSource.context();
  let groupAddress = context.getString('groupAddress');

  let group = Group.load(groupAddress);
  if(!group) return;

  let userGroup = UserGroup.load(user.id + "-" + group.id);
  if(!userGroup) return;

  if (user != null ) {
    userGroup.totalDeposited =  userGroup.totalDeposited.plus(event.params.quantity.toBigDecimal());
    userGroup.totalMinted = userGroup.totalMinted.plus(event.params.quantity.toBigDecimal());
    userGroup.save();
  }
}

export function handleNewMint(event: NewMint): void {
  let user = User.load(event.params.user.toHex());
  if(!user) return;

  let context = dataSource.context();
  let groupAddress = context.getString('groupAddress');

  let group = Group.load(groupAddress);
  if(!group) return;

  let userGroup = UserGroup.load(user.id + "-" + group.id);
  if(!userGroup) return;

  if (user != null) {
    userGroup.totalDeposited =  userGroup.totalDeposited.minus(event.params.quantity.toBigDecimal());
    userGroup.totalMinted = userGroup.totalMinted.minus(event.params.quantity.toBigDecimal());
    userGroup.save();
  }
}

