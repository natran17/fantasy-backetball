from espn_api.basketball import League

espn_s2 = 'AEBpWjL/L8Aa5D9vFKaCIU6TO1c46u80YnWNP+j5thb9MW7/0SAnKrS5BTlW1PJ4N4G0zzj4JekQe0QaSbcmecRK/BqRTCT7Su/O/pJUQlBopG40jsuLDZV7JHBcrKlbvBRgoSNf8HuMEhQpn8hVB5es+PeFhuqgG+jKJ+s3PWUYmvJssKXSovxMucoxSyu4+n8UOav77cE6Ko9wzlSFZmetF7o9oypel1BrTxmIn5TmrCDdkQtxcQtE0MtXQO5lv5S91FloSwXlpU32uW3g/KJXiqcX3iogA2lygopcnsgC6Jz9amey1Pf6KccYD4tf60I='
swid = '{2DCFAD38-DF88-4340-9F88-40583150C9D7}'
league = League(league_id=1465450080, year=2026, espn_s2=espn_s2, swid=swid, fetch_league=False)

league.fetch_league()
print(league.draft)



# print(league.teams)
# print(league.standings())