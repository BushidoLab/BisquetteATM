<!-- ALICE/SELLER -->

https://insiders.liveshare.vsengsaas.visualstudio.com/join?2435E502B62182667DCCB2AAE1A7A623077D
<!-- DIEGO/BUYER -->

./bisq-desktop --baseCurrencyNetwork=BTC_REGTEST --useLocalhostForP2P=true --useDevPrivilegeKeys=true --nodePort=5558 --appName=bisq-BTC_REGTEST_Daigogo --desktopWithHttpApi=true --enableHttpApiExperimentalFeatures --httpApiPort=4456


<!-- SEED 1 -->
./bisq-seednode --baseCurrencyNetwork=BTC_REGTEST --useLocalhostForP2P=true --useDevPrivilegeKeys=true --myAddress=62be07a0.ngrok.io:8080 --appName=bisq-BTC_REGTEST_Seed_2002 --nodePort=2002

<!-- SEED 2 -->
./bisq-seednode --baseCurrencyNetwork=BTC_REGTEST --useLocalhostForP2P=true --useDevPrivilegeKeys=true --myAddress=62be07a0.ngrok.io:2006 --appName=bisq-BTC_REGTEST_Seed_2002 --nodePort=2006

<!-- ARBITRATOR -->
./bisq-desktop --baseCurrencyNetwork=BTC_REGTEST --useLocalhostForP2P=true --useDevPrivilegeKeys=true --nodePort=4449 --appName=bisq-BTC_REGTEST_arbitrator