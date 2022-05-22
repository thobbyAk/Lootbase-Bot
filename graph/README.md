# lootbot Subgraph


Lootbot is a bot that lets you collect & own NFTs with friends


## Commands
### Production 

Build with network configuration (networks.json)
```
yarn build --network rinkeby
```
Deploy to the hosted service
```
yarn deploy 
```
## Example Queries
### Query groups

This query fetches all groups created 

```graphql
{ 
  groups {
    id
    address
    groupName
    groupSymbol
    treasureAddress
  }
}
```