import { CoinGeckoClient } from './CoinGeckoClient';
import { PLATFORMS } from './Enum';

const client = new CoinGeckoClient();
jest.setTimeout(30000)
describe('CoinGeckoClient test', () => {
  it('ping should successful', async () => {
    const ping = await client.ping();
    expect(ping).toEqual({ gecko_says: '(V3) To the Moon!' })
  })

  it('/search/trending should successful', async () => {
    const trending = await client.trending();
    expect(trending.coins?.length).toBeGreaterThan(1);
    trending.coins?.forEach(({ item }) => expect(item).toMatchObject({
      id: expect.any(String),
      large: expect.any(String),
      market_cap_rank: expect.any(Number),
      name: expect.any(String),
      score: expect.any(Number),
      symbol: expect.any(String),
      thumb: expect.any(String),
    }))
  })

  it('/coins/list should successful', async () => {
    const list = await client.coinList({ include_platform: true });
    expect(list.length).toBeGreaterThan(1)
  })

  it('/coins/market should successful', async () => {
    const list = await client.coinMarket({ vs_currency: 'usd', ids: 'origin-protocol,bitcorn' });
    expect(list.length).toEqual(2)
    expect(list).toMatchSnapshot();
  })

  it('/coins/{id}/tickers should successful', async () => {
    const ticker = await client.coinTickers({ id: 'origin-protocol' });
    expect(ticker.name).toEqual("Origin Protocol")
    expect(ticker.tickers.length).toBeGreaterThan(0)
  })

  it('/coins/{id}/history should successful', async () => {
    const coin = await client.coinHistory({ id: 'bitcoin', date: '01-04-2021' });
    expect(coin.name).toEqual("Bitcoin")
    expect(coin.localization).not.toBeNull();
    expect(coin).toMatchSnapshot();
  })

  it('/coins/{id}/history should successful with no localization', async () => {
    const coin = await client.coinHistory({ id: 'bitcoin', date: '01-04-2021', localization: false });
    expect(coin.name).toEqual("Bitcoin")
    expect(coin.localization).toEqual(undefined);
  })

  it('/coins/{id}/market_chart should successful', async () => {
    const marketChart = await client.coinMarketChart({ id: 'bitcoin', vs_currency: 'aud', interval: 'hourly', days: 1 });
    expect(marketChart.prices.length).toBeGreaterThan(12)
    expect(marketChart.prices[0].length).toBe(2)
    expect(marketChart.prices[0][0]).toBeGreaterThan(0)
    expect(marketChart.prices[0][1]).toBeGreaterThan(0)
  })

  it('/coins/{id}/market_chart/range should successful', async () => {
    const marketChart = await client.coinMarketChartRange({ id: 'bitcoin', vs_currency: 'aud', from: 1392577232, to: 1618716149 });
    expect(marketChart.prices.length).toBeGreaterThan(12)
    expect(marketChart.prices[0].length).toBe(2)
    expect(marketChart.prices[0][0]).toBeGreaterThan(0)
    expect(marketChart.prices[0][1]).toBeGreaterThan(0)
  })

  it('/coins/{id}/status_updates should successful', async () => {
    const statusUpdate = await client.coinStatusUpdates({ id: 'litecoin' });
    expect(statusUpdate.status_updates.length).toBeGreaterThan(0)
  })

  it('/coins/{id}/ohlc should successful', async () => {
    const ohlc = await client.coinOHLC({ id: 'litecoin', vs_currency: 'aud', days: 30 });
    expect(ohlc.length).toBeGreaterThan(0)
    expect(ohlc[0].length).toBe(5)
  })


  it('/simple/market should successful', async () => {
    const price = await client.simpleTokenPrice({ contract_addresses: '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26', id: 'ethereum', vs_currencies: 'btc,eth' });
    expect(price).toMatchObject({
      '0x8207c1ffc5b6804f6024322ccf34f29c3541ae26': {
        btc: expect.any(Number),
        eth: expect.any(Number)
      }
    });
  })

  it('/simple/supported_vs_currencies should successful', async () => {
    const list = await client.simpleSupportedCurrencies();
    expect(list).toMatchSnapshot();
  })
  describe('Contract', () => {
    it('/coins/{id}/contract/{contract_address} should successful', async () => {
      const aave = await client.contract({ id: 'ethereum', 'contract_address': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9' });
      expect(aave.name).toBe('Aave');
    })

    it('/coins/{id}/contract/{contract_address}/market_chart should successful', async () => {
      const aave = await client.contractMarketChart({
        id: 'ethereum',
        'contract_address': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', vs_currency: 'aud', days: 5
      });
      expect(aave.prices.length).toBeGreaterThan(0);
    })

    it('/coins/{id}/contract/{contract_address}/market_chart/range should successful', async () => {
      const aave = await client.contractMarketChartRange({
        id: 'ethereum',
        'contract_address': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', vs_currency: 'eth',
        from: 1392577232,
        to: 1618716149
      });
      expect(aave.prices.length).toBeGreaterThan(0);
      expect(aave.market_caps.length).toBeGreaterThan(0);
      expect(aave.total_volumes.length).toBeGreaterThan(0);
    })
  })

  describe('Exchange', () => {
    it('/exchanges should successful', async () => {
      const exchanges = await client.exchanges({
      });
      expect(exchanges.length).toBeGreaterThan(0);

      expect(exchanges[0]).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        country: expect.any(String),
        description: expect.any(String),
        has_trading_incentive: expect.any(Boolean),
        image: expect.any(String),
        trade_volume_24h_btc: expect.any(Number),
        trade_volume_24h_btc_normalized: expect.any(Number),
        trust_score: expect.any(Number),
        trust_score_rank: expect.any(Number),
        url: expect.any(String),
        year_established: expect.any(Number),
      })
    })

    it('/exchange/list should successful', async () => {
      const exchanges = await client.exchangeList();
      expect(exchanges.length).toBeGreaterThan(0);

      expect(exchanges[0]).toEqual({
        id: 'aave',
        name: 'Aave'
      })
    })

    it('/exchange/id should successful', async () => {
      const aave = await client.exchangeId('aave');
      expect(aave.name).toEqual('Aave');
    })

    it('/exchange/id/tickers should successful', async () => {
      const aave = await client.exchangeIdTickers({ id: 'aave' });
      expect(aave.name).toEqual('Aave');
      expect(aave.tickers.length).toBeGreaterThan(1);
    })

    it('/exchange/id/status_update should successful', async () => {
      const aave = await client.exchangeIdStatusUpdates({ id: 'whitebit' });
      expect(aave.status_updates.length).toBeGreaterThan(1);
    })

    it('/exchange/id/volume_chart should successful', async () => {
      const aave = await client.exchangeIdVolumeChart({ id: 'whitebit', days: 1 });
      expect(aave.length).toBeGreaterThan(1);
    })


  })

})
