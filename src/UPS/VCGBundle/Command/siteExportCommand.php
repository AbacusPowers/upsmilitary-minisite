<?php

namespace UPS\VCGBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;

class SiteExportCommand extends ContainerAwareCommand
{

    private $urls = array(
        '/transition-guide/dd-form-214-guide.html'
    );


    protected function configure() {
        $this
            ->setName('ups:site:export')
            ->setDescription('Export site to flat file setup')
        ;
    }


    protected function execute(InputInterface $input, OutputInterface $output) {
//        if (! function_exists('json_encode')) {
//            $output->writeln("\n<error> JSON extension is required </error>\n");
//            return;
//        }
//
//        $csvPath = $input->getArgument(self::ARG_CSV);
//        $this->output = $output;
//        $this->import($csvPath);
    }
}
?>
