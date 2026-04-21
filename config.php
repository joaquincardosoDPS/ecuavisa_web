<?php
/**
 * Config Service - PHP Version
 * Equivalent to src/services/config.ts
 * 
 * This class provides the same functionality as the TypeScript ConfigService
 * for fetching social authentication configuration from the Rudo API.
 */

class ConfigService {
    
    /**
     * Get social configuration from Rudo API
     * 
     * @param string $client The client identifier (default: 'dps')
     * @return array Social configuration array
     */
    public static function getSocialConfig($client = 'dps') {
        try {
            // Prepare POST data
            $postData = array(
                'client' => $client
            );
            
            // Initialize cURL
            $ch = curl_init();
            
            // Configure cURL options
            curl_setopt_array($ch, array(
                CURLOPT_URL => 'https://consumers.rudo.video/config/all',
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => http_build_query($postData),
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 30,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/x-www-form-urlencoded',
                    'User-Agent: Mozilla/5.0 (compatible; ConfigService-PHP/1.0)'
                )
            ));
            
            // Execute request
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $error = curl_error($ch);
            
            curl_close($ch);
            
            // Check for cURL errors
            if ($response === false || !empty($error)) {
                error_log("ConfigService cURL Error: " . $error);
                return self::getDefaultConfig();
            }
            
            // Check HTTP status
            if ($httpCode !== 200) {
                error_log("ConfigService HTTP Error: " . $httpCode);
                return self::getDefaultConfig();
            }
            
            // Decode JSON response
            $data = json_decode($response, true);
            
            // Validate response structure
            if (!$data || !isset($data['data'])) {
                error_log("ConfigService: Invalid response structure");
                return self::getDefaultConfig();
            }
            
            // Extract and validate required fields
            $config = $data['data'];
            
            return array(
                'google_active' => isset($config['google_active']) ? (bool)$config['google_active'] : false,
                'google_id' => isset($config['google_id']) ? (string)$config['google_id'] : '',
                'ios_active' => isset($config['ios_active']) ? (bool)$config['ios_active'] : false,
                'ios_id_web' => isset($config['ios_id_web']) ? (string)$config['ios_id_web'] : '',
                'ios_redirect_uri' => isset($config['ios_redirect_uri']) ? (string)$config['ios_redirect_uri'] : null,
                'facebook_active' => isset($config['facebook_active']) ? (bool)$config['facebook_active'] : false,
                'politicas_privacidad' => isset($config['politicas-privacidad']) ? (string)$config['politicas-privacidad'] : '#',
                'terminos_condiciones' => isset($config['terminos-condiciones']) ? (string)$config['terminos-condiciones'] : '#'
            );
            
        } catch (Exception $e) {
            error_log("ConfigService Exception: " . $e->getMessage());
            return self::getDefaultConfig();
        }
    }
    
    /**
     * Get default configuration when API fails
     * 
     * @return array Default social configuration
     */
    private static function getDefaultConfig() {
        return array(
            'google_active' => false,
            'google_id' => '',
            'ios_active' => false,
            'ios_id_web' => '',
            'ios_redirect_uri' => null,
            'facebook_active' => false,
            'politicas_privacidad' => '#',
            'terminos_condiciones' => '#'
        );
    }
    
    /**
     * Get configuration as JSON string
     * Useful for JavaScript integration
     * 
     * @param string $client The client identifier
     * @return string JSON encoded configuration
     */
    public static function getSocialConfigJson($client = 'dps') {
        $config = self::getSocialConfig($client);
        return json_encode($config, JSON_PRETTY_PRINT);
    }
    
    /**
     * Check if a specific social provider is active
     * 
     * @param string $provider Provider name ('google', 'ios', 'facebook')
     * @param string $client The client identifier
     * @return bool True if provider is active
     */
    public static function isSocialProviderActive($provider, $client = 'dps') {
        $config = self::getSocialConfig($client);
        $key = $provider . '_active';
        
        return isset($config[$key]) ? $config[$key] : false;
    }
    
    /**
     * Get social provider configuration
     * 
     * @param string $provider Provider name ('google', 'ios', 'facebook')
     * @param string $client The client identifier
     * @return array Provider specific configuration
     */
    public static function getSocialProviderConfig($provider, $client = 'dps') {
        $config = self::getSocialConfig($client);
        $result = array();
        
        foreach ($config as $key => $value) {
            if (strpos($key, $provider . '_') === 0) {
                $result[$key] = $value;
            }
        }
        
        return $result;
    }
}

// Example usage:
/*
// Get full configuration
$config = ConfigService::getSocialConfig('dps');
print_r($config);

// Get as JSON
$configJson = ConfigService::getSocialConfigJson('dps');
echo $configJson;

// Check if Google is active
$googleActive = ConfigService::isSocialProviderActive('google', 'dps');
echo $googleActive ? 'Google is active' : 'Google is not active';

// Get Google specific config
$googleConfig = ConfigService::getSocialProviderConfig('google', 'dps');
print_r($googleConfig);
*/

?>
