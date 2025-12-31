import requests

league_id = 1465450080
year = 2024
espn_s2 = 'AEBpWjL/L8Aa5D9vFKaCIU6TO1c46u80YnWNP+j5thb9MW7/0SAnKrS5BTlW1PJ4N4G0zzj4JekQe0QaSbcmecRK/BqRTCT7Su/O/pJUQlBopG40jsuLDZV7JHBcrKlbvBRgoSNf8HuMEhQpn8hVB5es+PeFhuqgG+jKJ+s3PWUYmvJssKXSovxMucoxSyu4+n8UOav77cE6Ko9wzlSFZmetF7o9oypel1BrTxmIn5TmrCDdkQtxcQtE0MtXQO5lv5S91FloSwXlpU32uW3g/KJXiqcX3iogA2lygopcnsgC6Jz9amey1Pf6KccYD4tf60I='
swid = '{2DCFAD38-DF88-4340-9F88-40583150C9D7}'

# ESPN's API endpoint
url = f'https://fantasy.espn.com/apis/v3/games/fba/seasons/{year}/segments/0/leagues/{league_id}'

cookies = {
    'espn_s2': espn_s2,
    'SWID': swid
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}


response = requests.get(url, cookies=cookies)
print(f"Status Code: {response.status_code}")
print(f"Response: {response.text[:500]}")